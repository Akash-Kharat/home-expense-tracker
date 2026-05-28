declare const _default: () => {
    port: number;
    database: {
        url: string | undefined;
    };
    jwt: {
        secret: string;
        expiration: string;
    };
    frontendUrl: string;
};
export default _default;
