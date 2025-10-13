import { Component, OnInit, ViewChild } from '@angular/core';

import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Patient, PatientVisit } from './patient.model';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule
],
})
export class PatientProfileComponent implements OnInit {
  // Sample patient data
  patient: Patient = new Patient({
    id: 'P001',
    img: 'assets/images/user/user4.jpg',
    name: 'Sarah Smith',
    gender: 'Female',
    age: 35,
    dob: '1989-05-15',
    maritalStatus: 'Married',
    nationalId: 'NAT123456789',

    email: 'sarah.smith@example.com',
    mobile: '+1 (123) 456-7890',
    address: '123 Main Street, Anytown, CA 94538',
    emergencyContactName: 'John Smith',
    emergencyContactRelation: 'Husband',
    emergencyContactPhone: '+1 (987) 654-3210',

    bGroup: 'A+',
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['Asthma', 'Hypertension'],
    currentMedications: ['Albuterol', 'Lisinopril'],
    pastMedicalHistory: 'Appendectomy in 2015, Fractured wrist in 2018',

    admissionDate: '2023-11-10',
    dischargeDate: '2023-11-15',
    status: 'discharged',
    doctorAssigned: 'Dr. Jacob Ryan',
    wardNumber: 'W-103',
    roomNumber: 'R-303',
    reasonForAdmission: 'Severe asthma attack',
    treatment: 'Respiratory therapy and medication adjustment',
  });

  // Sample visit history
  visitHistory: PatientVisit[] = [
    {
      id: 'V001',
      date: '2023-11-10',
      doctor: 'Dr. Jacob Ryan',
      treatment: 'Respiratory therapy',
      charges: 250,
      outcome: 'Improved',
    },
    {
      id: 'V002',
      date: '2023-08-22',
      doctor: 'Dr. Sophia Chen',
      treatment: 'Blood pressure check',
      charges: 120,
      outcome: 'Stable',
    },
    {
      id: 'V003',
      date: '2023-05-15',
      doctor: 'Dr. Jacob Ryan',
      treatment: 'Annual physical',
      charges: 180,
      outcome: 'Healthy',
    },
    {
      id: 'V004',
      date: '2023-02-03',
      doctor: 'Dr. Michael Lee',
      treatment: 'Flu symptoms',
      charges: 150,
      outcome: 'Recovered',
    },
  ];

  // Table columns for visit history
  displayedColumns: string[] = [
    'date',
    'doctor',
    'treatment',
    'charges',
    'outcome',
    'actions',
  ];

  constructor() {
    // constructor code
  }

  ngOnInit() {}
}
