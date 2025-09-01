
import dayjs from "dayjs";
import { bigNumberDiv } from "./common";

export function timestampToDate(timestamp: number, format = "YYYY-MM-DD HH:mm") {
    return dayjs(timestamp * 1000).format(format);
}

export function shortenNumber(value: string | number | null, decimalPlaces = 4) {
    if (!value) {
        return ""
    }
    let number = Number(value);
    const units = ['', 'K', 'M', 'G', 'T'];
    let unitIndex = 0;

    while (number >= 1000 && unitIndex < units.length - 1) {
        number /= 1000;
        unitIndex++;
    }
    const formattedNumber = Math.floor(Number(number.toFixed(decimalPlaces)))
    return `${formattedNumber}${units[unitIndex]}`;
}

export function shortenNumberUnits(value: string | number | null, decimalPlaces = 4) {
    if (!value) {
        return {
            shortenNumber: "",
            unit: ""
        }
    }
    let number = Number(value);
    const units = ['', 'K', 'M', 'G', 'T'];
    let unitIndex = 0;

    while (number >= 1000 && unitIndex < units.length - 1) {
        number /= 1000;
        unitIndex++;
    }
    const formattedNumber = Number(number.toFixed(decimalPlaces))
    return {
        shortenNumber: formattedNumber,
        unit: units[unitIndex]
    };
}

export function shortenNumberG(value: string | number | null, decimalPlaces = 4) {
    if (!value) {
        return 0
    }
    let number = Number(value);
    const units = ['', 'K', 'M', 'G', 'T'];
    let unitIndex = 0;
    number / 1000 / 1000 / 1000;
    let unitsNmber = bigNumberDiv(number, 1000 * 1000 * 1000)

    const formattedNumber = Number(unitsNmber.toFixed(decimalPlaces))
    return formattedNumber;
}
