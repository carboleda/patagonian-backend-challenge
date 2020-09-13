export default class SongNotFoundError extends Error {
    public readonly code = 404;

    constructor(private cause: Error | null = null) {
        super('Song not found');
        // this.cause = cause;
    }
}
