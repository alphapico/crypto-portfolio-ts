import fetch from "node-fetch";
import { CRYPTO_COMPARE_API_URL } from "../constant";
import { CryptoData } from "../interface/transaction.interface";
import { ExchangeRatesService } from "../interface/exchange-rate.interface";

export class CryptoCompareService implements ExchangeRatesService {
    async fetchExchangeRates(
        tokens: string[],
        currency: string = "USD"
    ): Promise<CryptoData> {
        try {
            const response = await fetch(
                `${CRYPTO_COMPARE_API_URL}/pricemulti?fsyms=${tokens.join(
                    ","
                )}&tsyms=${currency}&api_key=${
                    process.env.CRYPTO_COMPARE_API_KEY
                }`
            );
            return (await response.json()) as CryptoData;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to fetch exchange rates");
        }
    }

    async fetchExchangeRatesForDate(
        token: string,
        timestamp: number,
        currency: string = "USD"
    ): Promise<CryptoData> {
        try {
            const response = await fetch(
                `${CRYPTO_COMPARE_API_URL}/pricehistorical?fsym=${token}&tsyms=${currency}&ts=${timestamp}&api_key=${process.env.CRYPTO_COMPARE_API_KEY}`
            );
            return (await response.json()) as CryptoData;
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch exchange rate for ${token}`);
        }
    }
}
