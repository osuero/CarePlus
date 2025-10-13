import { Routes } from '@angular/router';
import { LayoutShellComponent } from './layout/layout-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/user-list/user-list.component').then((m) => m.UserListComponent)
      },
      {
        path: 'users/register',
        loadComponent: () =>
          import('./pages/user-registration/user-registration.component').then(
            (m) => m.UserRegistrationComponent
          )
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
