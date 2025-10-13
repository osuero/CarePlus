import { Route } from '@angular/router';

export const ADMIN_ROUTE: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
  },
  {
    path: 'appointment',
    loadChildren: () =>
      import('./appointment/appointment.routes').then(
        (m) => m.APPOINTMENT_ROUTE
      ),
  },
  {
    path: 'doctors',
    loadChildren: () =>
      import('./doctors/doctors.routes').then((m) => m.DOCTOR_ROUTE),
  },
  {
    path: 'staff',
    loadChildren: () =>
      import('./staff/staff.routes').then((m) => m.STAFF_ROUTE),
  },
  {
    path: 'patients',
    loadChildren: () =>
      import('./patients/patients.routes').then((m) => m.PATIENT_ROUTE),
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('./accounts/accounts.routes').then((m) => m.ACCOUNTS_ROUTE),
  },
  {
    path: 'room',
    loadChildren: () => import('./room/room.routes').then((m) => m.ROOMS_ROUTE),
  },
  {
    path: 'departments',
    loadChildren: () =>
      import('./departments/departments.routes').then(
        (m) => m.DEPARTMENT_ROUTE
      ),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.routes').then((m) => m.INVENTORY_ROUTE),
  },
  {
    path: 'records',
    loadChildren: () =>
      import('./records/records.routes').then((m) => m.RECORDS_ROUTE),
  },
  {
    path: 'ambulance',
    loadChildren: () =>
      import('./ambulance/ambulance.routes').then((m) => m.AMBULANCE_ROUTE),
  },
  {
    path: 'pharmacy',
    loadChildren: () =>
      import('./pharmacy/pharmacy.routes').then((m) => m.PHARMACY_ROUTE),
  },
  {
    path: 'blood-bank',
    loadChildren: () =>
      import('./blood-bank/blood-bank.routes').then((m) => m.BLOOD_BANK_ROUTE),
  },
  {
    path: 'human-resources',
    loadChildren: () =>
      import('./human-resources/human-resources.routes').then(
        (m) => m.HR_ROUTE
      ),
  },
  {
    path: 'insurance',
    loadChildren: () =>
      import('./insurance/insurance.routes').then((m) => m.INSURANCE_ROUTE),
  },
];
