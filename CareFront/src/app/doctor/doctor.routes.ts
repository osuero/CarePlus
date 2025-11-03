import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { PatientsComponent } from './patients/patients.component';
import { Page404Component } from '../authentication/page404/page404.component';
import { SettingsComponent } from './settings/settings.component';
import { AddPatientComponent } from '../admin/patients/add-patient/add-patient.component';
export const DOCTOR_ROUTE: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'appointments',
    loadChildren: () =>
      import('../appointments/appointments.routes').then(
        (m) => m.APPOINTMENTS_ROUTE
      ),
  },
  {
    path: 'doctors',
    component: DoctorsComponent,
  },
  {
    path: 'patients',
    component: PatientsComponent,
  },
  {
    path: 'patient-registration',
    component: AddPatientComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  { path: '**', component: Page404Component },
];

