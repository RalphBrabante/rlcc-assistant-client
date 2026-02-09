import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginPageGuard } from '../common/guards/login-page.guard';
import { appDashboardGuard } from '../common/guards/app-dashboard.guard';
import { adminGuard } from '../common/guards/admin.guard';
import { superuserGuard } from '../common/guards/superuser.guard';
import { superadminAdminGuard } from '../common/guards/superadmin-admin.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    canActivate: [loginPageGuard],
    loadChildren: () =>
      import('../features/pages/login-page/login-page.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'home',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'dashboard',
    canActivate: [appDashboardGuard],
    loadChildren: () =>
      import('../features/pages/dashboard-page/dashboard-page.module').then(
        (m) => m.DashboardPageModule
      ),
  },
  {
    path: 'tithes',
    canActivate: [appDashboardGuard],
    loadChildren: () =>
      import('../features/pages/tithes-page/tithes-page.module').then(
        (m) => m.TithesPageModule
      ),
  },
  {
    path: 'tithe-types',
    canActivate: [appDashboardGuard, adminGuard],
    loadChildren: () =>
      import('../features/pages/tithe-type-page/tithe-type-page.module').then(
        (m) => m.TitheTypePageModule
      ),
  },
  {
    path: 'circle-types',
    canActivate: [appDashboardGuard, adminGuard],
    loadChildren: () =>
      import(
        '../features/pages/life-group-types-page/life-group-types-page.module'
      ).then((m) => m.LifeGroupTypesPageModule),
  },
  {
    path: 'life-group-types',
    pathMatch: 'full',
    redirectTo: 'circle-types',
  },
  {
    path: 'circles',
    canActivate: [appDashboardGuard],
    loadChildren: () =>
      import('../features/pages/circles-page/circles-page.module').then(
        (m) => m.CirclesPageModule
      ),
  },
  {
    path: 'settings',
    canActivate: [appDashboardGuard, adminGuard],
    loadChildren: () =>
      import('../features/pages/settings-page/settings-page.module').then(
        (m) => m.SettingsPageModule
      ),
  },
  {
    path: 'members',
    canActivate: [appDashboardGuard, superadminAdminGuard],
    loadChildren: () =>
      import('../features/pages/members-page/members-page.module').then(
        (m) => m.MembersPageModule
      ),
  },
  {
    path: 'roles-permissions',
    canActivate: [appDashboardGuard, superadminAdminGuard],
    loadChildren: () =>
      import(
        '../features/pages/roles-permissions-page/roles-permissions-page.module'
      ).then((m) => m.RolesPermissionsPageModule),
  },
  {
    path: 'pco-users-migration',
    canActivate: [appDashboardGuard, superuserGuard],
    loadChildren: () =>
      import(
        '../features/pages/pco-users-migration-page/pco-users-migration-page.module'
      ).then((m) => m.PcoUsersMigrationPageModule),
  },
  {
    path: 'amqp-queues',
    canActivate: [appDashboardGuard, superuserGuard],
    loadChildren: () =>
      import(
        '../features/pages/amqp-queue-viewer-page/amqp-queue-viewer-page.module'
      ).then((m) => m.AmqpQueueViewerPageModule),
  },
  {
    path: 'documentation',
    canActivate: [appDashboardGuard, superadminAdminGuard],
    loadChildren: () =>
      import('../features/pages/documentation-page/documentation-page.module').then(
        (m) => m.DocumentationPageModule
      ),
  },
  {
    path: 'reported-bugs',
    canActivate: [appDashboardGuard, superadminAdminGuard],
    loadChildren: () =>
      import('../features/pages/reported-bugs-page/reported-bugs-page.module').then(
        (m) => m.ReportedBugsPageModule
      ),
  },
  {
    path: 'profile',
    canActivate: [appDashboardGuard],
    loadChildren: () =>
      import(
        '../features/pages/edit-profile-page/edit-profile-page.module'
      ).then((m) => m.EditProfilePageModule),
  },
  {
    path: 'report-bug',
    canActivate: [appDashboardGuard],
    loadChildren: () =>
      import('../features/pages/bug-report-page/bug-report-page.module').then(
        (m) => m.BugReportPageModule
      ),
  },
  {
    path: 'forbidden',
    loadChildren: () =>
      import('../features/pages/forbidden-page/forbidden-page.module').then(
        (m) => m.ForbiddenPageModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import(
        '../features/pages/not-found-page/not-found-page-routing.module'
      ).then((m) => m.NotFoundPageRoutingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
