import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Income } from '../../income.model';
import { IncomeService } from '../../income.service';

export interface DialogData {
  id: number;
  action: string;
  income: Income;
}

@Component({
    selector: 'app-bill-list-form',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    imports: [
        MatButtonModule,
        MatIconModule,
        MatDialogContent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatDialogClose,
    ]
})
export class IncomeFormComponent {
  action: string;
  dialogTitle: string;
  incomeForm: UntypedFormGroup;
  income: Income;

  constructor(
    public dialogRef: MatDialogRef<IncomeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public incomeService: IncomeService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit' ? data.income.patientName : 'New Income';
    this.income =
      this.action === 'edit' ? data.income : new Income({} as Income); // Create a blank object
    this.incomeForm = this.createIncomeForm();
  }

  // Create form group for bill list details
  createIncomeForm(): UntypedFormGroup {
    return this.fb.group({
      incomeId: [this.income.incomeId], // Unique ID for the income record
      patientId: [this.income.patientId], // Patient ID
      patientName: [this.income.patientName, [Validators.required]], // Patient Name
      serviceType: [this.income.serviceType, [Validators.required]], // Service Type
      serviceDate: [this.income.serviceDate, [Validators.required]], // Service Date
      amountBilled: [this.income.amountBilled, [Validators.required]], // Amount Billed
      amountPaid: [this.income.amountPaid, [Validators.required]], // Amount Paid
      paymentMethod: [this.income.paymentMethod], // Payment Method
      insuranceAmount: [this.income.insuranceAmount], // Insurance Amount
      outstandingAmount: [this.income.outstandingAmount], // Outstanding Amount
      paymentDate: [this.income.paymentDate], // Payment Date
      paymentStatus: [this.income.paymentStatus], // Payment Status
      doctorId: [this.income.doctorId], // Doctor ID
      doctorFee: [this.income.doctorFee], // Doctor Fee
      createdBy: [this.income.createdBy], // Created By
      createdAt: [this.income.createdAt], // Created At (timestamp)
      updatedBy: [this.income.updatedBy], // Updated By
      updatedAt: [this.income.updatedAt], // Updated At (timestamp)
      incomeType: [this.income.incomeType], // Income Type (e.g., Patient Payment)
      notes: [this.income.notes], // Notes
      invoiceNumber: [this.income.invoiceNumber], // Invoice Number
    });
  }

  getErrorMessage(control: UntypedFormControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    }
    return '';
  }

  // Submit form data
  submit() {
    if (this.incomeForm.valid) {
      const billData = this.incomeForm.getRawValue();
      if (this.action === 'edit') {
        this.incomeService.updateIncomeRecord(billData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
            // Optionally display an error message to the user
          },
        });
      } else {
        this.incomeService.addIncomeRecord(billData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Add Error:', error);
            // Optionally display an error message to the user
          },
        });
      }
    }
  }

  // Close dialog without action
  onNoClick(): void {
    this.dialogRef.close();
  }
}
