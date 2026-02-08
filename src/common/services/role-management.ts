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
