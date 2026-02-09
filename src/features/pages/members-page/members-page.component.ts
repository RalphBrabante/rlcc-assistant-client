import { Component, OnInit, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, forkJoin, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../common/directives/base-component';
import { PaginationComponent } from '../../../common/components/pagination/pagination.component';
import { RoleAssignmentUser } from '../../../common/services/role-management';
import { RoleManagementService } from '../../../common/services/role-management.service';
import { UserService } from '../../../common/services/user.service';

@Component({
  selector: 'app-members-page',
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.scss',
})
export class MembersPageComponent extends BaseComponent implements OnInit {
  pagination = viewChild<PaginationComponent>('pagination');

  form: FormGroup;
  loading = signal<boolean>(false);
  users = signal<RoleAssignmentUser[]>([]);
  dataCount = signal<number>(0);
  errorMessage = signal<string>('');

  roleOptions = signal<Array<{ id: number; name: string }>>([]);
  selectedUser = signal<RoleAssignmentUser | null>(null);
  selectedRoleIds = signal<number[]>([]);
  roleSaving = signal<boolean>(false);
  roleMessage = signal<string>('');
  roleError = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private roleMgmtSvc: RoleManagementService
  ) {
    super();
    this.form = this.fb.group({
      query: [''],
    });
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.loading.set(true);
    this.errorMessage.set('');

    const query = String(this.form.value.query || '').trim();
    const page = this.pagination()?.currentPage() || 1;
    const limit = this.pagination()?.pageSize || 10;

    forkJoin({
      members: this.userSvc.getMembers({ page, limit, query: query || undefined }),
      roles: this.roleMgmtSvc.getAssignableRoles(),
    })
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: ({ members, roles }) => {
          const rows = (members.data?.rows || []) as RoleAssignmentUser[];
          this.users.set(rows);
          this.dataCount.set(Number(members.data?.count || 0));
          this.roleOptions.set(roles.data?.roles || []);

          const selectedId = this.selectedUser()?.id;
          if (selectedId) {
            const refreshed = rows.find((u) => u.id === selectedId) || null;
            this.selectedUser.set(refreshed);
            this.selectedRoleIds.set(refreshed?.roles?.map((role) => role.id) || []);
          }
        },
        error: (error) => {
          this.users.set([]);
          this.dataCount.set(0);
          this.errorMessage.set(error?.error?.message || 'Unable to load members.');
        },
      });
  }

  onSearch() {
    this.pagination()?.currentPage.set(1);
    this.fetchData();
  }

  onReset() {
    this.form.reset({ query: '' });
    this.pagination()?.currentPage.set(1);
    this.fetchData();
  }

  selectUser(user: RoleAssignmentUser) {
    this.selectedUser.set(user);
    this.selectedRoleIds.set((user.roles || []).map((role) => role.id));
    this.roleMessage.set('');
    this.roleError.set('');
  }

  isRoleSelected(roleId: number) {
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
      this.roleError.set('Select a member first.');
      return;
    }

    this.roleSaving.set(true);
    this.roleMessage.set('');
    this.roleError.set('');

    this.roleMgmtSvc
      .updateUserRoles(user.id, this.selectedRoleIds())
      .pipe(
        finalize(() => this.roleSaving.set(false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          if (resp.data.token) {
            localStorage.setItem('RLCCAT', resp.data.token);
          }

          const updatedUser = resp.data.user;
          this.selectedUser.set(updatedUser);
          this.selectedRoleIds.set((updatedUser.roles || []).map((role) => role.id));
          this.users.set(
            this.users().map((item) => (item.id === updatedUser.id ? updatedUser : item))
          );
          this.roleMessage.set('Roles updated successfully.');
        },
        error: (error) => {
          this.roleError.set(error?.error?.message || 'Unable to update roles.');
        },
      });
  }

  fullName(user: RoleAssignmentUser) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
}
