import { Route } from '@angular/router';
import { PatientsComponent } from './patients.component';

export const PATIENTS_ROUTE: Route[] = [
  {
    path: '',
    component: PatientsComponent,
  },
];
