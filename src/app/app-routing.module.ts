import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginPageGuard } from '../common/guards/login-page.guard';
import { appDashboardGuard } from '../common/guards/app-dashboard.guard';

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
