import { HttpFormType, AUTH_ENUM } from "@traceo/types";

export const clearAuth = (params: HttpFormType) => {
    const auth = params.auth.type;
    switch (auth) {
        case AUTH_ENUM.BEARER_TOKEN:
            params.auth.api = null;
            params.auth.basic = null;
            break;
        case AUTH_ENUM.API_KEY:
            params.auth.bearer = null;
            params.auth.basic = null;
            break;
        case AUTH_ENUM.BASIC_AUTH:
            params.auth.bearer = null;
            params.auth.api = null;
            break;
        case AUTH_ENUM.NO_AUTH:
        default:
            params.auth.api = null;
            params.auth.bearer = null;
            params.auth.basic = null;
            break;
    }

    return params;
};
