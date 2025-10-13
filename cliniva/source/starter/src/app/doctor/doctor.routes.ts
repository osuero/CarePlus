import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Page404Component } from '../authentication/page404/page404.component';
export const DOCTOR_ROUTE: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  { path: '**', component: Page404Component },
];

