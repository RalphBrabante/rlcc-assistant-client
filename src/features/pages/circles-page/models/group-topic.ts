import { ApiResponse } from '../../../../common/services/api-response';

export interface GroupTopicComment {
  id: number;
  groupTopicId: number;
  createdBy: number;
  comment: string;
  parentCommentId?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
  replies?: GroupTopicComment[];
}

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
  comments?: GroupTopicComment[];
}

export type GroupTopicsApiResponse = ApiResponse<{ topics: GroupTopic[] }>;
export type GroupTopicApiResponse = ApiResponse<{ topic: GroupTopic }>;
export type GroupTopicCommentApiResponse = ApiResponse<{ topicComment: GroupTopicComment }>;
