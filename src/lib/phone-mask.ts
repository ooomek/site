export function formatRuPhone(value: string): string {
    const onlyDigits = value.replace(/\D/g, '');

    if (!onlyDigits) return '';

    let digits = onlyDigits;

    if (digits.startsWith('8')) {
        digits = `7${digits.slice(1)}`;
    } else if (!digits.startsWith('7')) {
        digits = `7${digits}`;
    }

    digits = digits.slice(0, 11);

    const d = digits.slice(1);
    let result = '+7';

    if (d.length > 0) result += ` (${d.slice(0, 3)}`;
    if (d.length >= 3) result += ')';
    if (d.length > 3) result += ` ${d.slice(3, 6)}`;
    if (d.length > 6) result += `-${d.slice(6, 8)}`;
    if (d.length > 8) result += `-${d.slice(8, 10)}`;

    return result;
}

