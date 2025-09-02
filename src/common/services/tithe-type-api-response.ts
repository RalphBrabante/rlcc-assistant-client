import { TitheType } from '../../features/pages/tithe-type/models/tithe-type';

export interface TitheTypeApiResponse {
  status: number;
  titheTypes: {
    count: number;
    rows: TitheType[];
  };
}

export interface TitheReportApiResponse {
  status: number;
  data: number[];
}
