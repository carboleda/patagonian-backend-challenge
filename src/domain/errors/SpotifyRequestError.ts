import { AxiosError } from "axios";
import ApiError from "./ApiError";

export default class SpotifyRequestError extends ApiError {
    constructor(cause: AxiosError | null = null) {
        super(`Spotify - ${cause?.message}`, cause?.response?.status || 500, cause);
    }
}
