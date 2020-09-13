type Paging = {
    DEFAULT_LIMIT: number;
    MAX_LIMIT?: number;
    DEFAULT_OFFSET: number;
};

type Populate = {
    CONCURRENCY: number;
    DELAY: number;
};

export default class Constants {
    public static MY_API_PAGING: Paging = {
        DEFAULT_LIMIT: 20,
        DEFAULT_OFFSET: 0
    };
    public static SPOFIFY_API_PAGING: Paging = {
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 50,
        DEFAULT_OFFSET: 0
    };
    public static POPULATE: Populate = {
        CONCURRENCY: 10,
        DELAY: 3000
    };
}
