import { ApiResponse } from '../../../../common/services/api-response';

export interface GroupChatSender {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export interface GroupChatMessage {
  id: number;
  groupId: number;
  senderId: number;
  type: 'text';
  content: string;
  isEdited: boolean;
  editedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sender?: GroupChatSender;
}

export type GroupChatMessagesResponse = ApiResponse<{
  groupId: number;
  messages: {
    count: number;
    rows: GroupChatMessage[];
  };
}>;

export type GroupChatSendResponse = ApiResponse<{
  message: GroupChatMessage;
}>;

export type GroupChatDeleteResponse = ApiResponse<{
  id: number;
  deleted: boolean;
}>;
