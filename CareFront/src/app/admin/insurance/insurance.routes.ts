import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { PatientInsuranceComponent } from './patient-insurance/patient-insurance.component';
import { NewClaimComponent } from './new-claim/new-claim.component';
import { ClaimStatusComponent } from './claim-status/claim-status.component';
import { InsuranceProviderComponent } from './insurance-provider/insurance-provider.component';

export const INSURANCE_ROUTE: Route[] = [
  {
    path: 'patient-insurance',
    component: PatientInsuranceComponent,
  },
  {
    path: 'new-claim',
    component: NewClaimComponent,
  },
  {
    path: 'claim-status',
    component: ClaimStatusComponent,
  },
  {
    path: 'insurance-provider',
    component: InsuranceProviderComponent,
  },
  { path: '**', component: Page404Component },
];
