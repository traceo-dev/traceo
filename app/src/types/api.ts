export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export type SortOrder = "ASC" | "DESC";
