export default interface Database<T> {
    connect(): Promise<void>;
    close(): Promise<void>;
    ping(): Promise<boolean>;
    getConnection(): Promise<T>;
}
