export interface Tithe {
  id?: number;
  amount: string;
  userId: number;
  isActive: boolean;
  titheTypeId: number;
  encoder?: {
    id: number;
    emailAddress: string;
  };
  dateReceived: string;
  createdAt: string;
  updatedAt: string;
}

export interface TitheAPIResp {
  status: number;
  tithes: {
    count: number;
    rows: Tithe[];
  };
}
