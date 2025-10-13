import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users'
      },
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
  {
    path: '**',
    redirectTo: ''
  }
];
