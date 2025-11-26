import { Route } from '@angular/router';
import { ConsultationsComponent } from './consultations.component';
import { ConsultationFormPageComponent } from './consultation-form-page.component';
import { ConsultationDetailPageComponent } from './consultation-detail-page.component';

export const CONSULTATIONS_ROUTE: Route[] = [
  {
    path: '',
    component: ConsultationsComponent,
  },
  {
    path: 'new',
    component: ConsultationFormPageComponent,
  },
  {
    path: ':id/detail',
    component: ConsultationDetailPageComponent,
  },
  {
    path: ':id/edit',
    component: ConsultationFormPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
