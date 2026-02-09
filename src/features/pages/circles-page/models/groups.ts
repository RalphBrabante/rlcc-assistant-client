import { GroupUser } from './user';
import { ApiResponse } from '../../../../common/services/api-response';

export interface Group {
  id?: number;
  name: string;
  userId?: number | null;
  leaderId?: number | null;
  groupMembers?: GroupUser[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  creator?: {
    id: number;
    firstName: string;
    lastName: string;
    emailAddress: string;
  } | null;
}

export interface GroupsPayload {
  groups: {
    count: number;
    rows: Group[];
  };
  group?: Group;
  id?: number;
}

export type GroupsAPIResp = ApiResponse<GroupsPayload>;
export type GroupUnassignedUsersAPIResp = ApiResponse<{
  count: number;
  rows: GroupUser[];
}>;

export interface AssignUsersToGroupAPI {
  code: number;
  data: any[];
}

export interface GroupUsers {
  userId: number;
  groupId: number;
}
