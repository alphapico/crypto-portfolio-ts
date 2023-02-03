export interface DatabaseRepository {
    addTransaction(
        transactionType: any,
        token: string,
        amount: number
    ): Promise<void>;
    readTransactions(uniqueTokens: Set<string>): Promise<any>;
}
