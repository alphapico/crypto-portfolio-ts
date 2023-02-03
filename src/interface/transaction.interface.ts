export type TransactionType = "DEPOSIT" | "WITHDRAWAL";

export interface PortfolioTransaction {
    timestamp: number;
    transactionType: TransactionType;
    token: string;
    amount: number;
}

export interface CryptoData {
    [token: string]: {
        [currency: string]: number;
    };
}
