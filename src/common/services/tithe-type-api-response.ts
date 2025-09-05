import { TitheType } from '../../features/pages/tithe-type-page/models/tithe-type';

export interface TitheTypeApiResponse {
  status: number;
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

export interface TitheReportApiResponse {
  status: number;
  data: number[];
}
