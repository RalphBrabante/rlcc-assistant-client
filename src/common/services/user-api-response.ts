export interface UserApiResponse {
  status: number;
  data: {
    count: number;
    rows: any[];
  };
}
