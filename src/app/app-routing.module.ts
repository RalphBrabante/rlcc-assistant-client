import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginPageGuard } from '../common/guards/login-page.guard';
import { appDashboardGuard } from '../common/guards/app-dashboard.guard';
import { adminGuard } from '../common/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [loginPageGuard],
    loadChildren: () =>
      import('../features/pages/login-page/login-page.module').then(
        (m) => m.LoginPageModule
      ),
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
    path: 'life-group-types',
    canActivate: [appDashboardGuard, adminGuard],
    loadChildren: () =>
      import(
        '../features/pages/life-group-types-page/life-group-types-page.module'
      ).then((m) => m.LifeGroupTypesPageModule),
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
