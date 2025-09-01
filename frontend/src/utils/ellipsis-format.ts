export function ellipsis(value?: string): string {
    if (!value) {
        return "";
    }
    const len = value.length;
    if (!value) return '';
    if (value.length > 40) {
        return `${value.substring(0, 10)}......${value.substring(len - 20, len)}`;
    }
    return value;
}
export function ellipsis5(value?: string): string {
    if (!value) {
        return "";
    }
    const len = value.length;
    if (!value) return '';
    if (value.length > 20) {
        return `${value.substring(0, 5)}......${value.substring(len - 5, len)}`;
    }
    return value;
}

export function ellipsis30(value?: string): string {
    if (!value) {
        return "";
    }
    const len = value.length;
    if (!value) return '';
    if (value.length > 70) {
        return `${value.substring(0, 30)}......${value.substring(len - 30, len)}`;
    }
    return value;
}

