export default class Utilities {
    public static isValidArtistId(id: string): boolean {
        return id.length === 22;
    }
}
