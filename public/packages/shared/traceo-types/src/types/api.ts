export interface RequestUser {
    id: string;
    username: string;
}

export interface ApiResponse<T> {
    status: "success" | "error";
    message: string;
    data: T;
}

export type SortOrder = "DESC" | "ASC";
