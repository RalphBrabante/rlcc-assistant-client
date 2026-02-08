import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../appConfig';
import { ApiResponse } from './api-response';
import { ManagedRole, RoleAssignmentUser, RolePermission } from './role-management';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementService {
  constructor(private http: HttpClient) {}

  getRoles(): Observable<ApiResponse<{ roles: ManagedRole[] }>> {
    return this.http.get<ApiResponse<{ roles: ManagedRole[] }>>(
      `${baseUrl}/roles`
    );
  }

  getPermissions(): Observable<ApiResponse<{ permissions: RolePermission[] }>> {
    return this.http.get<ApiResponse<{ permissions: RolePermission[] }>>(
      `${baseUrl}/roles/permissions`
    );
  }

  createRole(name: string): Observable<ApiResponse<{ role: ManagedRole }>> {
    return this.http.post<ApiResponse<{ role: ManagedRole }>>(`${baseUrl}/roles`, {
      role: { name },
    });
  }

  updateRolePermissions(
    roleId: number,
    permissionIds: number[]
  ): Observable<ApiResponse<{ role: ManagedRole; token?: string | null }>> {
    return this.http.patch<ApiResponse<{ role: ManagedRole; token?: string | null }>>(
      `${baseUrl}/roles/${roleId}/permissions`,
      { permissionIds }
    );
  }

  deleteRole(roleId: number): Observable<ApiResponse<{ id: number; deleted: boolean }>> {
    return this.http.delete<ApiResponse<{ id: number; deleted: boolean }>>(
      `${baseUrl}/roles/${roleId}`
    );
  }

  getAssignableRoles(): Observable<ApiResponse<{ roles: Array<Pick<ManagedRole, 'id' | 'name'>> }>> {
    return this.http.get<ApiResponse<{ roles: Array<Pick<ManagedRole, 'id' | 'name'>> }>>(
      `${baseUrl}/roles/assignable`
    );
  }

  searchUsersForRoleAssignment(
    query: string
  ): Observable<ApiResponse<{ users: RoleAssignmentUser[] }>> {
    return this.http.get<ApiResponse<{ users: RoleAssignmentUser[] }>>(
      `${baseUrl}/roles/user-roles/users/search?q=${encodeURIComponent(query)}`
    );
  }

  updateUserRoles(
    userId: number,
    roleIds: number[]
  ): Observable<ApiResponse<{ user: RoleAssignmentUser; token?: string | null }>> {
    return this.http.patch<ApiResponse<{ user: RoleAssignmentUser; token?: string | null }>>(
      `${baseUrl}/roles/user-roles/users/${userId}`,
      { roleIds }
    );
  }
}
