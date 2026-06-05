import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }
  const roles: string[] = route.data?.['roles'] ?? [];
  if (roles.length && !roles.includes(auth.currentUser?.role ?? '')) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
