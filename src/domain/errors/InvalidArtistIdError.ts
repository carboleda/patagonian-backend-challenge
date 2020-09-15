import ApiError from "./ApiError";

export default class InvalidArtistIdError extends ApiError {
    constructor(id: string, cause: Error | null = null) {
        super(`Invalid Artist ID ${id}`, 400, cause);
    }
}
