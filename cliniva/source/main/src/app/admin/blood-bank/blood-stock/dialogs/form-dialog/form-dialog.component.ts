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
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BloodStock } from '../../blood-stock.model';
import { BloodStockService } from '../../blood-stock.service';

export interface DialogData {
  id: number;
  action: string;
  bloodStock: BloodStock;
}

@Component({
    selector: 'app-all-bloodStock-form-dialog',
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
        MatDatepickerModule,
        MatDialogClose,
    ]
})
export class BloodStockFormComponent {
  action: string;
  dialogTitle: string;
  bloodStockForm: UntypedFormGroup;
  bloodStock: BloodStock;

  constructor(
    public dialogRef: MatDialogRef<BloodStockFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public bloodStockService: BloodStockService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit' ? data.bloodStock.bloodType : 'New Blood';
    this.bloodStock =
      this.action === 'edit' ? data.bloodStock : new BloodStock({}); // Create a blank object
    this.bloodStockForm = this.createContactForm();
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      bloodProductID: [this.bloodStock.bloodProductID, [Validators.required]],
      bloodType: [this.bloodStock.bloodType, [Validators.required]],
      componentType: [this.bloodStock.componentType, [Validators.required]],
      quantityInStock: [this.bloodStock.quantityInStock, [Validators.required]],
      expiryDate: [this.bloodStock.expiryDate, [Validators.required]],
      collectionDate: [this.bloodStock.collectionDate, [Validators.required]],
      storageLocation: [this.bloodStock.storageLocation, [Validators.required]],
      donationStatus: [this.bloodStock.donationStatus, [Validators.required]],
      batchNumber: [this.bloodStock.batchNumber, [Validators.required]],
      conditionQualityStatus: [
        this.bloodStock.conditionQualityStatus,
        [Validators.required],
      ],
      temperatureRange: [
        this.bloodStock.temperatureRange,
        [Validators.required],
      ],
      dateLastUpdated: [this.bloodStock.dateLastUpdated, [Validators.required]],
    });
  }

  getErrorMessage(control: UntypedFormControl): string {
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  submit() {
    if (this.bloodStockForm.valid) {
      if (this.action === 'edit') {
        // Update existing doctor
        this.bloodStockService
          .updateBloodStock(this.bloodStockForm.getRawValue())
          .subscribe({
            next: (response) => {
              this.dialogRef.close(response); // Close dialog and return updated doctor data
            },
            error: (error) => {
              console.error('Update Error:', error);
              // Optionally display an error message to the user
            },
          });
      } else {
        // Add new doctor
        this.bloodStockService
          .addBloodStock(this.bloodStockForm.getRawValue())
          .subscribe({
            next: (response) => {
              this.dialogRef.close(response); // Close dialog and return newly added doctor data
            },
            error: (error) => {
              console.error('Add Error:', error);
              // Optionally display an error message to the user
            },
          });
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close(); // Close dialog without any action
  }
}
