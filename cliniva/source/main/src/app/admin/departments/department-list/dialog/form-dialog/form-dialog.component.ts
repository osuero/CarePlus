import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DepartmentListService } from '../../department-list.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DepartmentList } from '../../department-list.model';
import { formatDate } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  id: number;
  action: string;
  departmentList: DepartmentList;
}

@Component({
    selector: 'app-department-list-form',
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
        MatDatepickerModule,
        MatRadioModule,
        MatDialogClose,
    ]
})
export class DepartmentListFormComponent {
  action: string;
  dialogTitle: string;
  departmentListForm: UntypedFormGroup;
  departmentList: DepartmentList;

  constructor(
    public dialogRef: MatDialogRef<DepartmentListFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public departmentListService: DepartmentListService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit'
        ? 'Edit Department: ' + data.departmentList.d_name
        : 'Add New Department';
    this.departmentList =
      this.action === 'edit'
        ? data.departmentList
        : new DepartmentList({} as DepartmentList); // Create a blank DepartmentList object
    this.departmentListForm = this.createDepartmentListForm();
  }

  // Create form group for department list details
  createDepartmentListForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.departmentList.id],
      d_no: [this.departmentList.d_no],
      d_name: [this.departmentList.d_name, [Validators.required]],
      description: [this.departmentList.description],
      d_date: [
        formatDate(this.departmentList.d_date, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      d_head: [this.departmentList.d_head],
      status: [this.departmentList.status],
    });
  }

  // Dynamic error message retrieval
  getErrorMessage(controlName: string): string {
    const control = this.departmentListForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    return '';
  }

  // Submit form data
  submit() {
    if (this.departmentListForm.valid) {
      const departmentData = this.departmentListForm.getRawValue();
      if (this.action === 'edit') {
        this.departmentListService
          .updateDepartmentList(departmentData)
          .subscribe({
            next: (response) => {
              this.dialogRef.close(response);
            },
            error: (error) => {
              console.error('Update Error:', error);
              // Optionally show an error message to the user
            },
          });
      } else {
        this.departmentListService.addDepartmentList(departmentData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Add Error:', error);
            // Optionally show an error message to the user
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
