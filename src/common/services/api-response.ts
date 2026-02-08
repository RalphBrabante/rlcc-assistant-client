export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
  meta?: unknown;
}

export interface ApiErrorResponse {
  code: number;
  message: string;
  details?: unknown;
}
