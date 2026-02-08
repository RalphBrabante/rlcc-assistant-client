import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../appConfig';
import { ApiResponse } from './api-response';
import { ManagedRole, RolePermission } from './role-management';

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
  ): Observable<ApiResponse<{ role: ManagedRole }>> {
    return this.http.patch<ApiResponse<{ role: ManagedRole }>>(
      `${baseUrl}/roles/${roleId}/permissions`,
      { permissionIds }
    );
  }

  deleteRole(roleId: number): Observable<ApiResponse<{ id: number; deleted: boolean }>> {
    return this.http.delete<ApiResponse<{ id: number; deleted: boolean }>>(
      `${baseUrl}/roles/${roleId}`
    );
  }
}
