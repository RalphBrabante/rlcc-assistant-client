import { GroupUser } from './user';

export interface Group {
  id?: number;
  name: string;
  groupMembers?: GroupUser[];
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

export interface GroupUnassignedUsersAPIResp {
  status: number;
  data: {
    count: number;
    rows: GroupUser[];
  };
}

export interface AssignUsersToGroupAPI {
  status: number;
  data: any[];
}

export interface GroupUsers {
  userId: number;
  groupId: number;
}
