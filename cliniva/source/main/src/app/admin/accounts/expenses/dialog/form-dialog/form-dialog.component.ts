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
import { Expenses } from '../../expenses.model';
import { ExpensesService } from '../../expenses.service';

export interface DialogData {
  id: number;
  action: string;
  expenses: Expenses;
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
export class ExpensesFormComponent {
  action: string;
  dialogTitle: string;
  expensesForm: UntypedFormGroup;
  expenses: Expenses;

  constructor(
    public dialogRef: MatDialogRef<ExpensesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public expensesService: ExpensesService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit' ? data.expenses.description : 'New Expense';
    this.expenses =
      this.action === 'edit' ? data.expenses : new Expenses({} as Expenses); // Create a blank object
    this.expensesForm = this.createExpensesForm();
  }

  // Create form group for bill list details
  createExpensesForm(): UntypedFormGroup {
    return this.fb.group({
      expense_id: [this.expenses.expense_id], // Unique ID for the expenses record
      date: [this.expenses.date, [Validators.required]], // Expense date
      category: [this.expenses.category, [Validators.required]], // Category of the expense
      description: [this.expenses.description, [Validators.required]], // Description of the expense
      amount: [this.expenses.amount, [Validators.required]], // Expense amount
      vendor: [this.expenses.vendor, [Validators.required]], // Vendor name
      invoice_number: [this.expenses.invoice_number], // Invoice Number
      payment_method: [this.expenses.payment_method, [Validators.required]], // Payment Method
      department: [this.expenses.department, [Validators.required]], // Department
      budget_code: [this.expenses.budget_code], // Budget Code
      employee_responsible: [this.expenses.employee_responsible], // Employee responsible
      approval_status: [this.expenses.approval_status, [Validators.required]], // Approval status
      payment_status: [this.expenses.payment_status, [Validators.required]], // Payment status
      notes: [this.expenses.notes], // Additional notes
      tax: [this.expenses.tax, [Validators.required]], // Tax amount
      total_cost: [this.expenses.total_cost, [Validators.required]], // Total cost (amount + tax)
      currency: [this.expenses.currency, [Validators.required]], // Currency
      created_by: [this.expenses.created_by], // Created by
      created_at: [this.expenses.created_at], // Created at (timestamp)
      updated_by: [this.expenses.updated_by], // Updated by
      updated_at: [this.expenses.updated_at], // Updated at (timestamp)
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
    if (this.expensesForm.valid) {
      const billData = this.expensesForm.getRawValue();
      if (this.action === 'edit') {
        this.expensesService.updateExpensesRecord(billData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
            // Optionally display an error message to the user
          },
        });
      } else {
        this.expensesService.addExpensesRecord(billData).subscribe({
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
