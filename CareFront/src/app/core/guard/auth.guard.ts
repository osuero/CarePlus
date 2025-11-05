import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { LocalStorageService } from '../../shared/services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router, private store: LocalStorageService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('[AuthGuard] canActivate invoked for URL:', state.url);
    const normalizedUrl = state.url.startsWith('/')
      ? state.url
      : `/${state.url}`;
    const publicPaths = ['/auth/setup-password', '/authentication/setup-password'];
    const isPublic = publicPaths.some((path) => normalizedUrl.startsWith(path));
    console.log('[AuthGuard] Normalized URL:', normalizedUrl, 'Is public:', isPublic);
    if (isPublic) {
      console.log('[AuthGuard] Public route detected, allowing access.');
      return true;
    }

    const currentUser = this.store.get('currentUser');
    const hasValidUser =
      currentUser &&
      typeof currentUser === 'object' &&
      Object.keys(currentUser).length > 0;
    console.log('[AuthGuard] Retrieved currentUser:', currentUser, 'Has valid user:', hasValidUser);

    if (hasValidUser) {
      const userRole = currentUser.roles?.[0]?.name; // Optional chaining to safely access the role
      console.log('[AuthGuard] User role detected:', userRole);
      // If no role exists, you might want to handle it (e.g., redirect or show an error)
      if (!userRole) {
        console.warn('[AuthGuard] User has no role, redirecting to signin.');
        this.router.navigate(['/authentication/signin']);
        return false;
      }

      // Check if the route requires a specific role and if the user's role matches
      if (
        route.data['role'] &&
        route.data['role'].indexOf(userRole) === -1
      ) {
        console.warn(
          '[AuthGuard] User role does not match route requirements. Redirecting to signin.',
          'Required roles:',
          route.data['role']
        );
        // If the role does not match, navigate to the signin page
        this.router.navigate(['/authentication/signin']);
        return false;
      }
      console.log('[AuthGuard] Role validated. Access granted.');
      return true;
    }

    // If no current user is found, redirect to signin
    console.warn('[AuthGuard] No current user found. Redirecting to signin.');
    this.router.navigate(['/authentication/signin']);
    return false;
  }
}
