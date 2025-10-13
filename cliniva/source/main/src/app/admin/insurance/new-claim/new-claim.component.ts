
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';

@Component({
    selector: 'app-new-claim',
    imports: [
        BreadcrumbComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        FileUploadComponent,
        MatButtonModule
    ],
    templateUrl: './new-claim.component.html',
    styleUrl: './new-claim.component.scss'
})
export class NewClaimComponent implements OnInit {
  insuranceClaimForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.insuranceClaimForm = this.fb.group({
      patientName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')], // Only alphabets
      ],
      patientId: [
        '',
        [Validators.required, Validators.pattern('^[0-9a-zA-Z]+$')], // Alphanumeric
      ],
      dateOfBirth: ['', Validators.required], // Date of birth field

      // Insurance Provider Details
      insuranceProvider: ['', Validators.required],
      policyNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9a-zA-Z]+$')], // Alphanumeric
      ],
      policyHolderName: ['', Validators.pattern('^[a-zA-Z ]*$')],

      // Claim Information
      claimType: ['', Validators.required],
      claimAmount: ['', [Validators.required, Validators.min(1)]],
      claimDescription: ['', Validators.required],
      claimDate: ['', Validators.required],

      // Hospital and Treatment Details
      hospitalName: ['', Validators.required],
      admissionDate: ['', Validators.required],
      dischargeDate: [''],
      diagnosis: ['', Validators.pattern('^[a-zA-Z0-9 ]*$')],
      treatmentProvided: ['', Validators.pattern('^[a-zA-Z0-9, ]*$')],

      // Additional Supporting Documents
      medicalReport: [null],
      invoiceReceipt: [null],

      // Contact Information
      contactNumber: ['', [Validators.pattern('^[0-9]+$')]],
      emailAddress: ['', [Validators.email]],

      // Terms and Conditions
      consentToProcess: [false, Validators.requiredTrue],

      // Signature
      signature: ['', Validators.pattern('^[a-zA-Z ]*$')],
    });
  }

  onSubmit(): void {
    if (this.insuranceClaimForm.valid) {
      console.log(this.insuranceClaimForm.value);
    }
  }
}
