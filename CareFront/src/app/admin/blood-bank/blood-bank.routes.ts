import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { BloodStockComponent } from './blood-stock/blood-stock.component';
import { BloodDonorComponent } from './blood-donor/blood-donor.component';
import { BloodIssuedComponent } from './blood-issued/blood-issued.component';

export const BLOOD_BANK_ROUTE: Route[] = [
  {
    path: 'blood-stock',
    component: BloodStockComponent,
  },
  {
    path: 'blood-donor',
    component: BloodDonorComponent,
  },
  {
    path: 'blood-issued',
    component: BloodIssuedComponent,
  },
  { path: '**', component: Page404Component },
];
