import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-editappointment',
  templateUrl: './editappointment.component.html',
  styleUrls: ['./editappointment.component.scss'],
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    FileUploadComponent,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class EditappointmentComponent implements OnInit {
  bookingForm!: UntypedFormGroup;
  isDisabled = true;

  // Arrays for dropdown options
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  departments = [
    'Cardiology',
    'Orthopedics',
    'Gynecology',
    'Neurology',
    'Pediatrics',
    'Psychiatry',
    'Oncology',
    'Dermatology',
    'Ophthalmology',
    'General Surgery',
  ];
  appointmentTypes = [
    { value: 'new', viewValue: 'New Patient' },
    { value: 'followup', viewValue: 'Follow-up' },
    { value: 'emergency', viewValue: 'Emergency' },
    { value: 'consultation', viewValue: 'Consultation' },
    { value: 'procedure', viewValue: 'Procedure/Surgery' },
  ];
  relationships = ['Self', 'Spouse', 'Child', 'Parent', 'Other'];

  // Time slots
  morningSlots = ['09:00 AM', '10:00 AM', '11:00 AM'];
  afternoonSlots = ['01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
  eveningSlots = ['05:00 PM', '06:00 PM', '07:00 PM'];

  // Dummy data (would typically come from API)
  formdata = {
    first: 'Pooja',
    middle: '',
    last: 'Sarma',
    gender: 'female',
    dob: '1987-02-17T14:22:18Z',
    bloodGroup: 'B+',
    mobile: '9876543210',
    email: 'test@example.com',
    patientId: 'PAT-001',
    address: '101, Elanxa, New York',

    insuranceProvider: 'Blue Cross',
    policyNumber: 'POL12345',
    groupNumber: 'GRP56789',
    insuranceHolderName: 'Rajesh Sharma',
    relationshipToPatient: 'spouse',

    medicalConditions: 'Diabetes',
    currentMedications: 'Metformin',
    allergies: 'Peanuts',
    previousSurgeries: 'Appendectomy - 2010',

    emergencyContactName: 'Ramesh Sharma',
    emergencyContactRelationship: 'parent',
    emergencyContactPhone: '9876543211',

    department: 'Cardiology',
    doctor: 'Dr.Rajesh',
    appointmentType: 'followup',
    doa: '2025-09-05T14:22:18Z',
    visitReason: 'Chest Pain',
    timeSlot: 'morning_1',
    injury: 'Mild pain in chest',
    note: 'Review last ECG',
    uploadFile: '',
  };

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      // same structure as BookappointmentComponent
      first: [
        this.formdata.first,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      middle: [this.formdata.middle],
      last: [this.formdata.last],
      gender: [this.formdata.gender, [Validators.required]],
      dob: [this.formdata.dob, [Validators.required]],
      bloodGroup: [this.formdata.bloodGroup],
      mobile: [
        this.formdata.mobile,
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      email: [
        this.formdata.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      patientId: [this.formdata.patientId],
      address: [this.formdata.address],

      insuranceProvider: [this.formdata.insuranceProvider],
      policyNumber: [this.formdata.policyNumber],
      groupNumber: [this.formdata.groupNumber],
      insuranceHolderName: [this.formdata.insuranceHolderName],
      relationshipToPatient: [this.formdata.relationshipToPatient],

      medicalConditions: [this.formdata.medicalConditions],
      currentMedications: [this.formdata.currentMedications],
      allergies: [this.formdata.allergies],
      previousSurgeries: [this.formdata.previousSurgeries],

      emergencyContactName: [this.formdata.emergencyContactName],
      emergencyContactRelationship: [
        this.formdata.emergencyContactRelationship,
      ],
      emergencyContactPhone: [this.formdata.emergencyContactPhone],

      department: [this.formdata.department, [Validators.required]],
      doctor: [this.formdata.doctor, [Validators.required]],
      appointmentType: [this.formdata.appointmentType, [Validators.required]],
      doa: [this.formdata.doa, [Validators.required]],
      visitReason: [this.formdata.visitReason, [Validators.required]],
      timeSlot: [this.formdata.timeSlot, [Validators.required]],
      injury: [this.formdata.injury],
      note: [this.formdata.note],
      uploadFile: [this.formdata.uploadFile],
    });
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      console.log('Updated Appointment:', this.bookingForm.value);
      // call API: this.appointmentService.updateAppointment(this.bookingForm.value).subscribe(...)
    } else {
      Object.keys(this.bookingForm.controls).forEach((key) => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    this.bookingForm.reset();
    // Set default values
    this.bookingForm.patchValue({
      gender: '',
      appointmentType: 'new',
      relationshipToPatient: 'self',
    });
  }
}
