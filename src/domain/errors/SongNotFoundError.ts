import ApiError from "./ApiError";

export default class SongNotFoundError extends ApiError {
    constructor(public cause: Error | null = null) {
        super('Song not found', cause);
    }
}
