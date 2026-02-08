import { ApiResponse } from '../../../../common/services/api-response';

export interface GroupTopic {
  id: number;
  groupId: number;
  createdBy: number;
  title: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  group?: {
    id: number;
    name: string;
    leaderId?: number | null;
  };
  creator?: {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
}

export type GroupTopicsApiResponse = ApiResponse<{ topics: GroupTopic[] }>;
export type GroupTopicApiResponse = ApiResponse<{ topic: GroupTopic }>;
