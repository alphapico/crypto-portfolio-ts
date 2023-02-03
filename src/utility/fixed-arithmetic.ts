import { BigNumber } from "bignumber.js";

export default function deci(...args: (string | number)[]): number {
    let result = new BigNumber(args[0]);
    for (let i = 1; i < args.length; i += 2) {
        let operator = args[i];
        let value = new BigNumber(args[i + 1]);
        switch (operator) {
            case "+":
                result = result.plus(value);
                break;
            case "-":
                result = result.minus(value);
                break;
            case "*":
                result = result.multipliedBy(value);
                break;
            case "/":
                result = result.dividedBy(value);
                break;
            default:
                throw new Error("Invalid operator: " + operator);
        }
    }
    return Number(result.toFixed(2));
}

// export default function deci(operation: string, ...nums: number[]): number {
//     const precisionFactor = 100;
//     switch (operation) {
//         case "+":
//             return (
//                 (nums.reduce((total, num) => total + num, 0) *
//                     precisionFactor) /
//                 precisionFactor
//             );
//         case "-":
//             return (
//                 (nums.reduce((total, num) => total - num) * precisionFactor) /
//                 precisionFactor
//             );
//         case "*":
//             return (
//                 (nums.reduce((total, num) => total * num, 1) *
//                     precisionFactor) /
//                 precisionFactor
//             );
//         case "/":
//             return (
//                 (nums.reduce((total, num) => total / num) * precisionFactor) /
//                 precisionFactor
//             );
//         default:
//             throw new Error(`Invalid operation: ${operation}`);
//     }
// }
