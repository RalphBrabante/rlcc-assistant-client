export interface Group {
  id?: number;
  name: string;
  isActive: boolean;
}

export interface GroupsAPIResp {
  status: number;
  groups: {
    count: number;
    rows: Group[];
  };
  group?: Group;
  id?: number;
}
