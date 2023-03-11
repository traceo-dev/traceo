export type BrowserInfoType = {
    browser: {
        name?: string;
        version?: string;
    };
    os: {
        name?: string;
        version?: string;
        versionName?: string;
    };
    platform: {
        type?: string;
    };
    engine: {
        name?: string;
        version?: string;
    };
    url: string;
};
