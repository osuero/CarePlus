import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DeathService } from '../../death.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Death } from '../../death.model';
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
  death: Death;
}

@Component({
    selector: 'app-death-form-dialog',
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
export class DeathFormComponent {
  action: string;
  dialogTitle: string;
  deathForm: UntypedFormGroup;
  death: Death;

  constructor(
    public dialogRef: MatDialogRef<DeathFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public deathService: DeathService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit'
        ? 'Patient Name: ' + data.death.patient_name
        : 'New Death';
    this.death = this.action === 'edit' ? data.death : new Death({} as Death);
    this.deathForm = this.createDeathForm();
  }

  // Create form group for death details
  createDeathForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.death.id],
      case_no: [this.death.case_no],
      patient_name: [this.death.patient_name, [Validators.required]],
      gender: [this.death.gender],
      death_date: [
        formatDate(this.death.death_date, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      guardian_name: [this.death.guardian_name], // corrected spelling
      mobile: [this.death.mobile, [Validators.pattern('^[0-9]{10}$')]], // Validating mobile number
      address: [this.death.address],
      note: [this.death.note],
    });
  }

  // Dynamic error message retrieval
  getErrorMessage(controlName: string): string {
    const control = this.deathForm.get(controlName);
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
    if (this.deathForm.valid) {
      const deathData = this.deathForm.getRawValue();
      if (this.action === 'edit') {
        this.deathService.updateDeath(deathData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Update Error:', error);
            // Optionally show an error message to the user
          },
        });
      } else {
        this.deathService.addDeath(deathData).subscribe({
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
