import { ApiResponse } from '../../../../common/services/api-response';

export interface Tithe {
  id?: number;
  amount: string;
  userId: number;
  isActive?: boolean;
  titheTypeId: number;
  encoder?: {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
  };
  giver?: {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
  };
  titheType?: {
    id: number;
    name: string;
  };
  dateReceived: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TitheApiPayload {
  tithes: {
    count: number;
    rows: Tithe[];
  };
  tithe?: Tithe;
  id?: number;
}

export type TitheAPIResp = ApiResponse<TitheApiPayload>;

export interface BulkTithePayload {
  index: number;
  userId: number;
  titheTypeId: number;
  titheTypeName: string;
  dateReceived: string;
  amount: string;
  fullName: string;
}
