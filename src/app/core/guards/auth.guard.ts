import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const requiredRoles: UserRole[] = route.data['roles'];
    if (requiredRoles?.length && !requiredRoles.includes(this.auth.currentUser!.role)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
