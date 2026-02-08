import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { adminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  let authSvc: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  const loginTree = { redirect: '/login' } as any;
  const forbiddenTree = { redirect: '/forbidden' } as any;

  beforeEach(() => {
    authSvc = jasmine.createSpyObj<AuthService>('AuthService', [
      'isLoggedIn',
      'getRoles',
    ]);
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    router.createUrlTree.and.callFake((commands: readonly any[]) => {
      if (commands[0] === '/login') return loginTree;
      return forbiddenTree;
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSvc },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('redirects to login when user is not authenticated', () => {
    authSvc.isLoggedIn.and.returnValue(false);
    const result = executeGuard({} as any, {} as any);

    expect(result).toBe(loginTree);
  });

  it('redirects to forbidden when user has no admin-level role', () => {
    authSvc.isLoggedIn.and.returnValue(true);
    authSvc.getRoles.and.returnValue(['MEMBER']);

    const result = executeGuard({} as any, {} as any);

    expect(result).toBe(forbiddenTree);
  });

  it('allows access for SUPERUSER', () => {
    authSvc.isLoggedIn.and.returnValue(true);
    authSvc.getRoles.and.returnValue(['SUPERUSER']);

    const result = executeGuard({} as any, {} as any);

    expect(result).toBeTrue();
  });
});
