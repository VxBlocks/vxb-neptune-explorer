import BigNumber from 'bignumber.js';
// +
export function bigNumberPlus(a: any, b: any) {
    a = BigNumber(a);
    b = BigNumber(b);
    return a.plus(b).toNumber();
}
// -
export function bigNumberMinus(a: any, b: any) {
    a = BigNumber(a);
    b = BigNumber(b);
    return a.minus(b).toNumber();
}
// -
export function bigNumberMinusToString(a: any, b: any) {
    a = BigNumber(a);
    b = BigNumber(b);
    return a.minus(b).toFixed().toString();
}
// *
export function bigNumberTimes(a: any, b: any) {
    a = BigNumber(a);
    b = BigNumber(b);
    return a.times(b).toNumber();
}

// *
export function bigNumberTimesToString(a: any, b: any) {
    a = BigNumber(a);
    b = BigNumber(b);
    return a.times(b).toFixed().toString();
}

// /
export function bigNumberDiv(a: any, b: any) {
    a = BigNumber(a);
    b = BigNumber(b);
    return a.div(b).toNumber();
}


// /
export function bigNumberDivToString(a: any, b: any) {
    a = BigNumber(a);
    b = BigNumber(b);
    return a.div(b).toFixed().toString();
}