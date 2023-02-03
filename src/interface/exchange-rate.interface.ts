export interface ExchangeRatesService {
    fetchExchangeRates(tokens: string[], currency?: string): Promise<any>;
    fetchExchangeRatesForDate(
        token: string,
        timestamp: number,
        currency?: string
    ): Promise<any>;
}
