import { TitheType } from '../../features/pages/tithe-type-page/models/tithe-type';
import { ApiResponse } from './api-response';

export interface TitheTypePayload {
  titheTypes: {
    count: number;
    rows: TitheType[];
  };
  titheType?: {
    id?: number;
    name?: number;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export type TitheTypeApiResponse = ApiResponse<TitheTypePayload>;
export type TitheReportApiResponse = ApiResponse<number[]>;
