import { Route } from '@angular/router';
import { AlldoctorsComponent } from './alldoctors/alldoctors.component';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';
import { EditDoctorComponent } from './edit-doctor/edit-doctor.component';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { Page404Component } from '../../authentication/page404/page404.component';
import { AssignDepartmentComponent } from './assign-department/assign-department.component';
import { ShiftManagementComponent } from './shift-management/shift-management.component';
export const DOCTOR_ROUTE: Route[] = [
  {
    path: 'allDoctors',
    component: AlldoctorsComponent,
  },
  {
    path: 'add-doctor',
    component: AddDoctorComponent,
  },
  {
    path: 'edit-doctor',
    component: EditDoctorComponent,
  },
  {
    path: 'assign-department',
    component: AssignDepartmentComponent,
  },
  {
    path: 'shift-management',
    component: ShiftManagementComponent,
  },
  {
    path: 'doctor-profile',
    component: DoctorProfileComponent,
  },
  { path: '**', component: Page404Component },
];
