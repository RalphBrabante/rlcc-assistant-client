import { Group } from './groups';

export interface GroupUser {
  id: number;
  pcoId?: string | number | null;
  firstName: string;
  lastName: string;
  avatar?: string | null;
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
