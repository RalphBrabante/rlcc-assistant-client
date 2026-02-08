export interface RolePermission {
  id: number;
  name: string;
  method: string;
  resource: string;
}

export interface ManagedRole {
  id: number;
  name: string;
  permissions: RolePermission[];
}

export interface RoleAssignmentUser {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  pcoId?: string | number | null;
  roles: Array<Pick<ManagedRole, 'id' | 'name'>>;
}
