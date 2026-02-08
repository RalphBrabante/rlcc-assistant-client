import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, forkJoin, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../common/directives/base-component';
import { ManagedRole, RolePermission } from '../../../common/services/role-management';
import { RoleManagementService } from '../../../common/services/role-management.service';

@Component({
  selector: 'app-roles-permissions-page',
  templateUrl: './roles-permissions-page.component.html',
  styleUrl: './roles-permissions-page.component.scss',
})
export class RolesPermissionsPageComponent extends BaseComponent implements OnInit {
  roles = signal<ManagedRole[]>([]);
  permissions = signal<RolePermission[]>([]);
  selectedRoleId = signal<number | null>(null);
  selectedPermissionIds = signal<Set<number>>(new Set());
  loading = signal<boolean>(false);
  savingPermissions = signal<boolean>(false);
  creatingRole = signal<boolean>(false);
  deletingRole = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  roleForm: FormGroup;

  constructor(
    private roleMgmtSvc: RoleManagementService,
    private fb: FormBuilder
  ) {
    super();
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  get roleName() {
    return this.roleForm.get('name') as FormControl;
  }

  loadData() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    forkJoin({
      roles: this.roleMgmtSvc.getRoles(),
      permissions: this.roleMgmtSvc.getPermissions(),
    })
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: ({ roles, permissions }) => {
          const allRoles = roles.data?.roles || [];
          const allPermissions = permissions.data?.permissions || [];

          this.roles.set(allRoles);
          this.permissions.set(allPermissions);

          if (allRoles.length) {
            const selectedRoleId = this.selectedRoleId();
            const hasSelectedRole = allRoles.some((role) => role.id === selectedRoleId);
            this.selectRole(hasSelectedRole ? selectedRoleId! : allRoles[0].id);
          } else {
            this.selectedRoleId.set(null);
            this.selectedPermissionIds.set(new Set());
          }
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Unable to load roles and permissions.');
        },
      });
  }

  createRole() {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const name = (this.roleName.value || '').trim();
    if (!name) return;

    this.creatingRole.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.roleMgmtSvc
      .createRole(name)
      .pipe(
        finalize(() => this.creatingRole.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          const role = resp.data.role;
          this.roles.set([...this.roles(), { ...role, permissions: role.permissions || [] }]);
          this.roleForm.reset();
          this.selectRole(role.id);
          this.successMessage.set('Role created successfully.');
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Unable to create role.');
        },
      });
  }

  selectRole(roleId: number) {
    this.selectedRoleId.set(roleId);
    const role = this.roles().find((item) => item.id === roleId);
    const permissionIds = new Set((role?.permissions || []).map((permission) => permission.id));
    this.selectedPermissionIds.set(permissionIds);
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  isPermissionChecked(permissionId: number) {
    return this.selectedPermissionIds().has(permissionId);
  }

  onPermissionToggle(permissionId: number, checked: boolean) {
    const next = new Set(this.selectedPermissionIds());
    if (checked) {
      next.add(permissionId);
    } else {
      next.delete(permissionId);
    }
    this.selectedPermissionIds.set(next);
  }

  savePermissions() {
    const roleId = this.selectedRoleId();
    if (!roleId) return;

    this.savingPermissions.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.roleMgmtSvc
      .updateRolePermissions(roleId, [...this.selectedPermissionIds()])
      .pipe(
        finalize(() => this.savingPermissions.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          if (resp.data.token) {
            localStorage.setItem('RLCCAT', resp.data.token);
          }
          const updatedRole = resp.data.role;
          this.roles.set(
            this.roles().map((role) => (role.id === updatedRole.id ? updatedRole : role))
          );
          this.selectRole(updatedRole.id);
          this.successMessage.set('Role permissions updated successfully.');
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Unable to save role permissions.');
        },
      });
  }

  deleteSelectedRole() {
    const roleId = this.selectedRoleId();
    if (!roleId || this.deletingRole()) return;
    if (this.isSelectedRoleSuperUser()) {
      this.errorMessage.set('The SUPERUSER role cannot be deleted.');
      return;
    }

    const roleName = this.selectedRoleName();
    const confirmed = window.confirm(
      `Delete role "${roleName}"? This will remove its role-permission mappings and user-role assignments.`
    );
    if (!confirmed) return;

    this.deletingRole.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.roleMgmtSvc
      .deleteRole(roleId)
      .pipe(
        finalize(() => this.deletingRole.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: () => {
          const remaining = this.roles().filter((role) => role.id !== roleId);
          this.roles.set(remaining);

          if (remaining.length) {
            this.selectRole(remaining[0].id);
          } else {
            this.selectedRoleId.set(null);
            this.selectedPermissionIds.set(new Set());
          }

          this.successMessage.set('Role deleted successfully.');
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Unable to delete role.');
        },
      });
  }

  selectedRoleName() {
    const role = this.roles().find((item) => item.id === this.selectedRoleId());
    return role?.name || 'Role';
  }

  isSelectedRoleSuperUser() {
    return this.selectedRoleName() === 'SUPERUSER';
  }

  areAllPermissionsSelected() {
    const allPermissions = this.permissions();
    if (!allPermissions.length) return false;
    const selected = this.selectedPermissionIds();
    return allPermissions.every((permission) => selected.has(permission.id));
  }

  onToggleAllPermissions(checked: boolean) {
    if (!checked) {
      this.selectedPermissionIds.set(new Set());
      return;
    }

    const allIds = this.permissions().map((permission) => permission.id);
    this.selectedPermissionIds.set(new Set(allIds));
  }
}
