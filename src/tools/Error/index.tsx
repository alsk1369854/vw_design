export class LogicalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LogicalError";
    }
}

export class UsageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UsageError";
    }
}