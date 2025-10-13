import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BirthService } from '../../birth.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Birth } from '../../birth.model';
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
  birth: Birth;
}

@Component({
    selector: 'app-birth-form-dialog',
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
        MatRadioModule,
        MatDatepickerModule,
        MatDialogClose,
    ]
})
export class BirthFormComponent {
  action: string;
  dialogTitle: string;
  birthForm: UntypedFormGroup;
  birth: Birth;

  constructor(
    public dialogRef: MatDialogRef<BirthFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public birthService: BirthService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit'
        ? 'Child Name: ' + data.birth.child_name
        : 'New Birth';
    this.birth = this.action === 'edit' ? data.birth : new Birth({} as Birth); // Create a blank Birth object
    this.birthForm = this.createBirthForm();
  }

  // Create form group for birth details
  createBirthForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.birth.id],
      case_no: [this.birth.case_no],
      child_name: [this.birth.child_name, [Validators.required]],
      gender: [this.birth.gender],
      birth_date: [
        formatDate(this.birth.birth_date, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      mother_name: [this.birth.mother_name],
      father_name: [this.birth.father_name],
      mobile: [this.birth.mobile, [Validators.pattern('^[0-9]{10}$')]], // Validating mobile number
      address: [this.birth.address],
      note: [this.birth.note],
    });
  }

  // Dynamic error message retrieval
  getErrorMessage(controlName: string): string {
    const control = this.birthForm.get(controlName);
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
    if (this.birthForm.valid) {
      const birthData = this.birthForm.getRawValue();
      if (this.action === 'edit') {
        this.birthService.updateBirth(birthData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
            // Optionally show an error message to the user
          },
        });
      } else {
        this.birthService.addBirth(birthData).subscribe({
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
