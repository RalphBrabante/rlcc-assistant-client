import { Group } from './groups';

export interface GroupUser {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  addressLine1?: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  assignedGroup?: Group[];
}
