import { ApiResponse } from './api-response';

export interface UserApiResponse {
  code: number;
  data: {
    count: number;
    rows: any[];
  };
}

export type UserCountApiResponse = ApiResponse<{ count: number }>;
