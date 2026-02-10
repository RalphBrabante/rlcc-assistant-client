import { GroupUser } from './user';
import { ApiResponse } from '../../../../common/services/api-response';

export interface Group {
  id?: number;
  name: string;
  groupTypeId?: number | null;
  groupType?: {
    id: number;
    name: string;
  } | null;
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
  isMember?: boolean;
  hasPendingJoinRequest?: boolean;
  pendingJoinRequestId?: number | null;
}

export interface GroupJoinRequest {
  id: number;
  groupId: number;
  userId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: number | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  requester?: GroupUser;
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
export type GroupJoinRequestsAPIResp = ApiResponse<{
  joinRequests: GroupJoinRequest[];
}>;

export interface AssignUsersToGroupAPI {
  code: number;
  data: any[];
}

export interface GroupUsers {
  userId: number;
  groupId: number;
}
