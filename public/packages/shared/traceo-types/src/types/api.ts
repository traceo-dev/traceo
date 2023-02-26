export interface RequestUser {
  id: string;
  username: string;
}

/**
 * Base interface for Api responses.
 *
 * Use cases:
 * - when status = "error" || "success" and
 *    message != null then in app visible is notify with this message
 * - when status = "error" and message == null
 *    then in app visible is notify with Internal server error
 * - when status = "error" and message == null
 *    and data.error != null then in app developer should handle this in UI
 *
 */
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T & { error?: string };
}

export type SortOrder = "DESC" | "ASC";
