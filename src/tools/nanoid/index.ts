let counter = 0;
export function nanoid(): string {
    return "" + counter++;
}