export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export type SortOrder = "ASC" | "DESC";
