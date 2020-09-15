import { AxiosError } from "axios";
import ApiError from "./ApiError";

export default class SpotifyRequestError extends ApiError {
    constructor(cause: AxiosError | null = null) {
        super(`Spotify - ${cause?.message}`);
        this.code = cause?.response?.status || 500;
        this.cause = cause;
    }
}
