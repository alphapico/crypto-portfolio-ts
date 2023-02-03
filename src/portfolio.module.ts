import { DatabaseRepository } from "./interface/database.interface";
import { CryptoData, TransactionType } from "./interface/transaction.interface";
import { ExchangeRatesService } from "./interface/exchange-rate.interface";
import deci from "./utility/fixed-arithmetic";

export class PortfolioModule {
    constructor(
        private exchangeRatesService: ExchangeRatesService,
        private dbRepo: DatabaseRepository
    ) {}

    async addPortfolioValue(
        transactionType: TransactionType,
        token: string,
        amount: number
    ) {
        await this.dbRepo.addTransaction(transactionType, token, amount);
    }

    async calculatePortfolioValue(
        token?: string,
        dateSinceEpoch?: number
    ): Promise<Record<string, number> | number> {
        let portfolioValue: Record<string, number> = {};
        let exchangeRates: CryptoData | undefined = {};
        let tokenExchangeRate: number;
        let uniqueTokens: Set<string> = new Set();

        let transactions = await this.dbRepo.readTransactions(uniqueTokens);
        // console.log({ transactions });

        if (dateSinceEpoch) {
            if (token) {
                exchangeRates =
                    await this.exchangeRatesService.fetchExchangeRatesForDate(
                        token,
                        dateSinceEpoch
                    );
            } else {
                const uniqueTokensArr = Array.from(uniqueTokens);
                // console.log({ uniqueTokensArr });
                for (let uniqueToken of uniqueTokensArr) {
                    const rate =
                        await this.exchangeRatesService.fetchExchangeRatesForDate(
                            uniqueToken,
                            dateSinceEpoch
                        );
                    exchangeRates = Object.assign(exchangeRates, {
                        [uniqueToken]: rate[uniqueToken],
                    });
                }
                // console.log({ exchangeRates });
            }

            if (exchangeRates === undefined) {
                throw new Error(
                    `Failed to fetch exchange rates for date: ${new Date(
                        dateSinceEpoch * 1000
                    ).toDateString()}`
                );
            }
        } else {
            exchangeRates = await this.exchangeRatesService.fetchExchangeRates(
                Array.from(uniqueTokens)
            );
            // console.log({ exchangeRates });
            if (exchangeRates === undefined) {
                throw new Error(`Failed to fetch exchange rates`);
            }
        }

        for (const p of transactions) {
            if (!portfolioValue[p.token]) {
                portfolioValue[p.token] = 0;
            }

            tokenExchangeRate =
                exchangeRates[p.token] && exchangeRates[p.token].USD
                    ? exchangeRates[p.token].USD
                    : 0;

            // console.log({ tokenExchangeRate });

            if (p.transactionType === "DEPOSIT") {
                if (!token || token === p.token) {
                    portfolioValue[p.token] = deci(
                        portfolioValue[p.token],
                        "+",
                        deci(p.amount, "*", tokenExchangeRate)
                    );
                }
            } else if (p.transactionType === "WITHDRAWAL") {
                if (!token || token === p.token) {
                    portfolioValue[p.token] = deci(
                        portfolioValue[p.token],
                        "-",
                        deci(p.amount, "*", tokenExchangeRate)
                    );
                }
            }
        }

        if (token) {
            if (!portfolioValue[token]) {
                throw new Error(`No transactions found for token: ${token}`);
            }
            return portfolioValue[token];
        }

        return portfolioValue;
    }
}
