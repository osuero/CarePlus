import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MedicineListService } from '../../medicine-list.service';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MedicineList } from '../../medicine-list.model';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

export interface DialogData {
  id: number;
  action: string;
  medicineList: MedicineList;
}

@Component({
    selector: 'app-medicine-list-form',
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
export class MedicineListFormComponent {
  action: string;
  dialogTitle: string;
  medicineListForm: UntypedFormGroup;
  medicineList: MedicineList;
  loading: boolean = false; // Loading state

  constructor(
    public dialogRef: MatDialogRef<MedicineListFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public medicineListService: MedicineListService,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {
    // Set the defaults
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit'
        ? 'Medicine Name: ' + data.medicineList.m_name
        : 'Add New Medicine';

    this.medicineList =
      this.action === 'edit'
        ? data.medicineList
        : new MedicineList({} as MedicineList); // Create a blank object
    this.medicineListForm = this.createMedicineListForm();
  }

  // Create form group for medicine list details
  createMedicineListForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.medicineList.id],
      m_no: [this.medicineList.m_no],
      m_name: [this.medicineList.m_name, [Validators.required]],
      category: [this.medicineList.category],
      company: [this.medicineList.company],
      p_date: [
        formatDate(this.medicineList.p_date, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      price: [this.medicineList.price],
      e_date: [
        formatDate(this.medicineList.e_date, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      stock: [this.medicineList.stock],
    });
  }

  // Dynamic error message retrieval for specific fields
  getErrorMessage(controlName: string): string {
    const control = this.medicineListForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('pattern')) {
      return 'Invalid mobile number';
    }
    return '';
  }

  // Submit form data
  submit() {
    if (this.medicineListForm.valid) {
      this.loading = true; // Start loading
      const formData = this.medicineListForm.getRawValue();
      if (this.action === 'edit') {
        this.medicineListService.updateMedicineList(formData).subscribe({
          next: (response) => {
            this.loading = false; // Stop loading
            this.snackBar.open('Medicine updated successfully!', 'Close', {
              duration: 2000,
            });
            this.dialogRef.close(response);
          },
          error: (error) => {
            this.loading = false; // Stop loading
            console.error('Update Error:', error);
            this.snackBar.open('Failed to update medicine.', 'Close', {
              duration: 2000,
            });
          },
        });
      } else {
        this.medicineListService.addMedicineList(formData).subscribe({
          next: (response) => {
            this.loading = false; // Stop loading
            this.snackBar.open('Medicine added successfully!', 'Close', {
              duration: 2000,
            });
            this.dialogRef.close(response);
          },
          error: (error) => {
            this.loading = false; // Stop loading
            console.error('Add Error:', error);
            this.snackBar.open('Failed to add medicine.', 'Close', {
              duration: 2000,
            });
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
