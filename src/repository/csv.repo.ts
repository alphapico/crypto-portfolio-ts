import {
    PortfolioTransaction,
    TransactionType,
} from "../interface/transaction.interface";
import * as fastCsv from "fast-csv";
import { FILE_DIR, FILE_HEADER, FILE_PATH } from "../constant";
import {
    createReadStream,
    createWriteStream,
    WriteStream,
    existsSync,
    mkdirSync,
} from "fs";
import { DatabaseRepository } from "../interface/database.interface";

export class CSVRepo implements DatabaseRepository {
    private getWriteStream(): WriteStream {
        return createWriteStream(FILE_PATH, { flags: "a" });
    }

    async addTransaction(
        transactionType: TransactionType,
        token: string,
        amount: number
    ): Promise<void> {
        try {
            if (!existsSync(FILE_DIR)) {
                mkdirSync(FILE_DIR);
            }
            if (!existsSync(FILE_PATH)) {
                fastCsv.writeToStream(
                    createWriteStream(FILE_PATH),
                    [FILE_HEADER],
                    {
                        headers: true,
                        includeEndRowDelimiter: true,
                    }
                );
            }

            return new Promise<void>((resolve, reject) => {
                const stream = this.getWriteStream();
                // time since epoch
                const transaction: PortfolioTransaction = {
                    timestamp: Math.floor(Date.now() / 1000),
                    transactionType,
                    token,
                    amount,
                };

                fastCsv
                    .writeToStream(stream, [transaction], {
                        headers: false,
                        includeEndRowDelimiter: true,
                    })
                    .on("finish", () => resolve())
                    .on("error", (error) => reject(error));
            });
        } catch (error) {
            console.error(`Could not add transaction: ${error}`);
        }
    }

    async readTransactions(
        uniqueTokens: Set<string>
    ): Promise<PortfolioTransaction[]> {
        try {
            if (!existsSync(FILE_PATH)) {
                return [];
            }

            const transactions: PortfolioTransaction[] = [];
            const readStream = createReadStream(FILE_PATH);

            return new Promise((resolve, reject) => {
                fastCsv
                    .parseStream(readStream, {
                        headers: true,
                        delimiter: ",",
                    })
                    .on("data", (row) => {
                        // console.log({ row });
                        uniqueTokens.add(row["token"]);
                        // transactions.push(row);
                        transactions.push({
                            timestamp: Number(row["timestamp"]),
                            transactionType: row[
                                "transaction_type"
                            ] as TransactionType,
                            token: row["token"],
                            amount: Number(row["amount"]),
                        });
                    })
                    .on("end", () => resolve(transactions))
                    .on("error", (error) => reject(error));
            });
        } catch (error) {
            console.error(`Could not read transactions file: ${error}`);
            throw new Error(`Could not read transactions file: ${error}`);
        }
    }
}
