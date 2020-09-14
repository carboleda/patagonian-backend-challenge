type RequestError = {
    message: string,
    response?: {
        status: number
    }
}

export default class SpofityRequestError extends Error {
    public code: number;

    constructor(public cause: RequestError | null = null) {
        super(`Spotify - ${cause?.message}`);
        this.code = cause?.response?.status || 500;
        this.cause = cause;
    }
}
