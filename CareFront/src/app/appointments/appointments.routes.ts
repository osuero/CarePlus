import { Route } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentsCalendarComponent } from './appointments-calendar.component';

export const APPOINTMENTS_ROUTE: Route[] = [
  {
    path: '',
    component: AppointmentsComponent,
  },
  {
    path: 'calendar',
    component: AppointmentsCalendarComponent,
  },
];
