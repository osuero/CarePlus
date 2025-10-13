import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BillListService } from '../../bill-list.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BillList } from '../../bill-list.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  action: string;
  billList: BillList;
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
export class BillListFormComponent {
  action: string;
  dialogTitle: string;
  billListForm: UntypedFormGroup;
  billList: BillList;

  constructor(
    public dialogRef: MatDialogRef<BillListFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public billListService: BillListService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit' ? data.billList.patientName : 'New Bill List';
    this.billList =
      this.action === 'edit' ? data.billList : new BillList({} as BillList); // Create a blank object
    this.billListForm = this.createBillListForm();
  }

  // Create form group for bill list details
  createBillListForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.billList.id],
      img: [this.billList.img],
      patientName: [this.billList.patientName, [Validators.required]],
      admissionID: [this.billList.admissionID, [Validators.required]],
      doctorName: [this.billList.doctorName, [Validators.required]],
      status: [this.billList.status, [Validators.required]],
      date: [this.billList.date, [Validators.required]],
      tax: [this.billList.tax],
      discount: [this.billList.discount],
      total: [this.billList.total, [Validators.required]],
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
    if (this.billListForm.valid) {
      const billData = this.billListForm.getRawValue();
      if (this.action === 'edit') {
        this.billListService.updateBillList(billData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
            // Optionally display an error message to the user
          },
        });
      } else {
        this.billListService.addBillList(billData).subscribe({
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
