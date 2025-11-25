import { Route } from '@angular/router';
import { PatientsComponent } from './patients.component';
import { PatientDetailComponent } from './patient-detail.component';

export const PATIENTS_ROUTE: Route[] = [
  {
    path: '',
    component: PatientsComponent,
  },
  {
    path: ':id',
    component: PatientDetailComponent,
  },
];
