export interface ApiResponseWithoutData {
  code: number;
  message?: string;
  data?: unknown;
}
