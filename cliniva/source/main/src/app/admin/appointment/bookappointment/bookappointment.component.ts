import { Component } from '@angular/core';
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
  selector: 'app-bookappointment',
  templateUrl: './bookappointment.component.html',
  styleUrls: ['./bookappointment.component.scss'],
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
export class BookappointmentComponent {
  bookingForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
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
  constructor(private fb: UntypedFormBuilder) {
    this.bookingForm = this.fb.group({
      // Patient Information
      first: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      middle: [''],
      last: [''],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      bloodGroup: [''],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      patientId: [''],
      address: [''],

      // Insurance Information
      insuranceProvider: [''],
      policyNumber: [''],
      groupNumber: [''],
      insuranceHolderName: [''],
      relationshipToPatient: ['self'],

      // Medical History
      medicalConditions: [''],
      currentMedications: [''],
      allergies: [''],
      previousSurgeries: [''],

      // Emergency Contact
      emergencyContactName: [''],
      emergencyContactRelationship: [''],
      emergencyContactPhone: [''],

      // Appointment Details
      department: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      appointmentType: ['new', [Validators.required]],
      doa: ['', [Validators.required]],
      visitReason: ['', [Validators.required]],
      timeSlot: ['', [Validators.required]],
      injury: [''],
      note: [''],
      uploadFile: [''],
    });
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      console.log('Form Value', this.bookingForm.value);
      // Here you would typically send the data to your backend service
      // this.appointmentService.bookAppointment(this.bookingForm.value).subscribe(...);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.bookingForm.controls).forEach((key) => {
        const control = this.bookingForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  get f() {
    return this.bookingForm.controls;
  }

  // Helper methods for form validation
  hasError(controlName: string, errorName: string): boolean {
    const control = this.bookingForm.get(controlName);
    return control
      ? control.hasError(errorName) && (control.dirty || control.touched)
      : false;
  }

  // Reset form to initial state
  resetForm(): void {
    this.bookingForm.reset();
    // Set default values
    this.bookingForm.patchValue({
      gender: '',
      appointmentType: 'new',
      relationshipToPatient: 'self',
    });
  }

  // Check if a field is required
  isRequired(controlName: string): boolean {
    const control = this.bookingForm.get(controlName);
    if (!control) return false;

    const validator = control.validator && control.validator({} as any);
    return validator && validator['required'] ? true : false;
  }
}
