import { Role } from './role';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatar?:string;
  pcoId: string;
  emailAddress: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  createdAt: string;
  updatedAt: string;
  roles?: Role[];
}
