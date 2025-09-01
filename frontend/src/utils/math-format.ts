import { bigNumberDiv, bigNumberTimesToString } from "./common";

export function numberConverTo(input: number | string | null | undefined) {
    let formatValue = ''
    if (input) {
        formatValue = input.toString()
    }
    let value = formatNumberWithCommas(formatValue)
    return value
}
export function numberConverToNoCommas(input: number | string | null | undefined) {
    let formatValue = ''
    if (input) {
        formatValue = input.toString()
    }
    let value = formatNumberWithNoCommas(formatValue)
    return value
}

export function formatNumberWithCommas(numberStr: string): string { 
    const parts = numberStr.split('.');
    const integerPart = parts[0] || '0';
    const decimalPart = parts[1] || '';
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (decimalPart) {
        return `${formattedInteger}.${decimalPart}`
    }
    return `${formattedInteger}`
}
export function formatNumberWithNoCommas(numberStr: string): string {
    const parts = numberStr.split('.');
    const integerPart = parts[0] || '0';
    const decimalPart = parts[1] || '';
    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (decimalPart) {
        return `${formattedInteger}`
    }
    return `${formattedInteger}`
}

export function tokenFormat(token: number | string | null | undefined) {
    const result = '1' + '0'.repeat(30);
    let tokens =  bigNumberDiv(token,result) 
    return Number(tokens.toFixed(4))
}


export function munberToTokenFormat(value: number | string | null | undefined) {
    const result = '1' + '0'.repeat(30);
    let tokens = bigNumberTimesToString(value, result)
    return tokens
}