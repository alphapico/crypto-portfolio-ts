import * as yargs from "yargs";
import { PortfolioModule } from "./portfolio.module";
import { CryptoCompareService } from "./provider/crypto-compare.service";
import { CSVRepo } from "./repository/csv.repo";

const cryptoCompareService = new CryptoCompareService();
const csvRepo = new CSVRepo();
const portfolio = new PortfolioModule(cryptoCompareService, csvRepo);

const argv = yargs
    .command("add", "Add a transaction to portfolio", {
        type: {
            describe: "Transaction type (DEPOSIT/WITHDRAWAL)",
            demandOption: true,
            type: "string",
        },
        token: {
            describe: "Token (e.g. BTC, ETH)",
            demandOption: true,
            type: "string",
        },
        amount: {
            describe: "Transaction amount",
            demandOption: true,
            type: "number",
        },
    })
    .command("calculate", "Calculate portfolio value", {
        token: {
            describe: "Token (e.g. BTC, ETH)",
            type: "string",
        },
        date: {
            describe: "Date (epoch time)",
            type: "number",
        },
    })
    .demandCommand()
    .help().argv;

if (argv._[0] === "add") {
    // console.log(argv);
    portfolio
        .addPortfolioValue(argv.type, argv.token, argv.amount)
        .then((result) => console.log("Transaction added to portfolio"))
        .catch((error) => console.error(error.message));
} else if (argv._[0] === "calculate") {
    portfolio
        .calculatePortfolioValue(argv.token, argv.date)
        .then((result) => console.log(result))
        .catch((error) => console.error(error.message));
}
