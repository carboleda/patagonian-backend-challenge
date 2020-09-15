export default class ApiError extends Error {
    public code: number = 500;

    constructor(message: string, public cause: Error | null = null) {
        super(message);
        this.cause = cause;
    }
}
