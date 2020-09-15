import ApiError from "./ApiError";

export default class InvalidArtistIdError extends ApiError {
    constructor(id: string, public cause: Error | null = null) {
        super(`Invalid Artist ID ${id}`, cause);
        this.code = 400;
    }
}
