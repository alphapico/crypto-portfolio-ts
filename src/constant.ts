import { resolve } from "path";

export const FILE_NAME = "transactions.csv";
export const FILE_HEADER = ["timestamp", "transaction_type", "token", "amount"];
export const FILE_DIR = resolve(__dirname, "../files");
export const FILE_PATH = resolve(FILE_DIR, FILE_NAME);

export const CRYPTO_COMPARE_API_URL = "https://min-api.cryptocompare.com/data";
