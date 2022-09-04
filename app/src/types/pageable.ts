export interface PageableResponse<T> {
  data: T[];
  meta: PageableMeta;
}

export interface PageableMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
