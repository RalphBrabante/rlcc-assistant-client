import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../../common/directives/base-component';
import { ServerConfiguration } from '../../../common/services/server-configuration';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { takeUntil } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../../common/services/auth.service';
import { RoleManagementService } from '../../../common/services/role-management.service';
import { RoleAssignmentUser } from '../../../common/services/role-management';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent extends BaseComponent implements OnInit {
  serverConfigurations = signal<ServerConfiguration[]>([]);
  canUpdateSystemSettings = signal<boolean>(false);
  canManageUserRoles = signal<boolean>(false);
  roleOptions = signal<Array<{ id: number; name: string }>>([]);
  roleSearchResults = signal<RoleAssignmentUser[]>([]);
  selectedUser = signal<RoleAssignmentUser | null>(null);
  selectedRoleIds = signal<number[]>([]);
  roleManagementLoading = signal<boolean>(false);
  roleSaving = signal<boolean>(false);
  roleSearchMessage = signal<string>('');
  roleSaveMessage = signal<string>('');
  roleSaveError = signal<string>('');
  saveSettingsLoading = signal<boolean>(false);
  settingsSaveMessage = signal<string>('');
  settingsSaveError = signal<string>('');

  form!: FormGroup;
  roleSearchForm!: FormGroup;

  constructor(
    private serverConfSvc: ConfigurationService,
    private roleMgmtSvc: RoleManagementService,
    private authSvc: AuthService,
    private fb: FormBuilder
  ) {
    super();

    this.form = this.fb.group({
      maintenanceMode: [false],
      devMode: [false],
    });

    this.roleSearchForm = this.fb.group({
      query: [''],
    });
  }

  ngOnInit(): void {
    const hasPrivilegedAccess = this.authSvc.isSuperUser() || this.authSvc.isAdmin();
    this.canUpdateSystemSettings.set(hasPrivilegedAccess);
    this.canManageUserRoles.set(hasPrivilegedAccess);
    this.fetchData();

    if (this.canManageUserRoles()) {
      this.fetchAssignableRoles();
    }
  }

  get maintenanceMode() {
    return this.form.get('maintenanceMode') as FormControl;
  }

  get devMode() {
    return this.form.get('devMode') as FormControl;
  }

  get query() {
    return this.roleSearchForm.get('query') as FormControl;
  }

  fetchData() {
    this.serverConfSvc
      .getServerConfigurations()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.serverConfigurations.set(resp.data.serverConfigurations);

          this.maintenanceMode.setValue(
            Boolean(
              resp.data.serverConfigurations.find(
                (c) => c.name === 'maintenance_mode'
              )?.value === 'true'
            )
          );

          this.devMode.setValue(
            Boolean(
              resp.data.serverConfigurations.find((c) => c.name === 'dev_mode')
                ?.value === 'true'
            )
          );
        },
      });
  }

  saveSettings() {
    if (!this.canUpdateSystemSettings()) {
      this.settingsSaveError.set('Only superusers and administrators can update these settings.');
      return;
    }

    this.saveSettingsLoading.set(true);
    this.settingsSaveMessage.set('');
    this.settingsSaveError.set('');

    this.serverConfSvc
      .updateServerConfigurations([
        {
          name: 'maintenance_mode',
          value: this.maintenanceMode.value ? 'true' : 'false',
        },
        {
          name: 'dev_mode',
          value: this.devMode.value ? 'true' : 'false',
        },
      ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.saveSettingsLoading.set(false);
          this.settingsSaveMessage.set('Settings updated successfully.');
          this.fetchData();
        },
        error: (error) => {
          this.saveSettingsLoading.set(false);
          this.settingsSaveError.set(
            error?.error?.message || 'Unable to save settings right now.'
          );
        },
      });
  }

  fetchAssignableRoles() {
    this.roleMgmtSvc
      .getAssignableRoles()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.roleOptions.set(resp.data.roles);
        },
      });
  }

  onSearchUsers() {
    const searchText = String(this.query.value || '').trim();
    this.roleSearchMessage.set('');
    this.roleSaveMessage.set('');
    this.roleSaveError.set('');
    this.selectedUser.set(null);
    this.selectedRoleIds.set([]);

    if (!searchText) {
      this.roleSearchResults.set([]);
      this.roleSearchMessage.set('Enter a username/email, ID, or PCOID to search.');
      return;
    }

    this.roleManagementLoading.set(true);
    this.roleMgmtSvc
      .searchUsersForRoleAssignment(searchText)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.roleManagementLoading.set(false);
          this.roleSearchResults.set(resp.data.users);
          if (!resp.data.users.length) {
            this.roleSearchMessage.set('No users matched your search.');
          }
        },
        error: (error) => {
          this.roleManagementLoading.set(false);
          this.roleSearchMessage.set(
            error?.error?.message || 'Unable to search users right now.'
          );
        },
      });
  }

  selectUser(user: RoleAssignmentUser) {
    this.selectedUser.set(user);
    this.selectedRoleIds.set(user.roles.map((role) => role.id));
    this.roleSaveMessage.set('');
    this.roleSaveError.set('');
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoleIds().includes(roleId);
  }

  toggleRole(roleId: number, checked: boolean) {
    const current = this.selectedRoleIds();
    const next = checked
      ? Array.from(new Set([...current, roleId]))
      : current.filter((id) => id !== roleId);

    this.selectedRoleIds.set(next);
  }

  saveUserRoles() {
    const user = this.selectedUser();

    if (!user) {
      this.roleSaveError.set('Select a user first.');
      return;
    }

    this.roleSaving.set(true);
    this.roleSaveMessage.set('');
    this.roleSaveError.set('');

    this.roleMgmtSvc
      .updateUserRoles(user.id, this.selectedRoleIds())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.roleSaving.set(false);
          if (resp.data.token) {
            localStorage.setItem('RLCCAT', resp.data.token);
          }
          this.selectedUser.set(resp.data.user);
          this.selectedRoleIds.set(resp.data.user.roles.map((role) => role.id));
          this.roleSearchResults.set(
            this.roleSearchResults().map((result) =>
              result.id === resp.data.user.id ? resp.data.user : result
            )
          );
          this.roleSaveMessage.set('Roles updated successfully.');
        },
        error: (error) => {
          this.roleSaving.set(false);
          this.roleSaveError.set(
            error?.error?.message || 'Unable to update roles at the moment.'
          );
        },
      });
  }
}
