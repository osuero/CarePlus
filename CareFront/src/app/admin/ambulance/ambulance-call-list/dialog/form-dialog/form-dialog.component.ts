import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AmbulanceCallListService } from '../../ambulance-call-list.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AmbulanceCallList } from '../../ambulance-call-list.model';
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
  ambulanceCallList: AmbulanceCallList;
}

@Component({
    selector: 'app-ambulance-call-list-form',
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
export class AmbulanceCallListFormComponent {
  action: string;
  dialogTitle: string;
  ambulanceCallListForm: UntypedFormGroup;
  ambulanceCallList: AmbulanceCallList;

  constructor(
    public dialogRef: MatDialogRef<AmbulanceCallListFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public ambulanceCallListService: AmbulanceCallListService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit'
        ? 'Patient Name: ' + data.ambulanceCallList.patient_name
        : 'Add Ambulance Call';
    this.ambulanceCallList =
      this.action === 'edit'
        ? data.ambulanceCallList
        : new AmbulanceCallList({}); // Create a blank object
    this.ambulanceCallListForm = this.createAmbulanceCallListForm();
  }

  // Create form group for ambulance call list details
  createAmbulanceCallListForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.ambulanceCallList.id],
      case_no: [this.ambulanceCallList.case_no],
      patient_name: [
        this.ambulanceCallList.patient_name,
        [Validators.required],
      ],
      patient_no: [this.ambulanceCallList.patient_no],
      gender: [this.ambulanceCallList.gender],
      date: [
        formatDate(this.ambulanceCallList.date, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      vehicle_no: [this.ambulanceCallList.vehicle_no],
      driver_name: [this.ambulanceCallList.driver_name],
      driver_no: [this.ambulanceCallList.driver_no],
      patient_address: [this.ambulanceCallList.patient_address],
      note: [this.ambulanceCallList.note],
    });
  }

  // Dynamic error message retrieval
  getErrorMessage(controlName: string): string {
    const control = this.ambulanceCallListForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    // Additional error messages can be added here
    return '';
  }

  // Submit form data
  submit() {
    if (this.ambulanceCallListForm.valid) {
      const callListData = this.ambulanceCallListForm.getRawValue();
      if (this.action === 'edit') {
        this.ambulanceCallListService
          .updateAmbulanceCallList(callListData)
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
        this.ambulanceCallListService
          .addAmbulanceCallList(callListData)
          .subscribe({
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
