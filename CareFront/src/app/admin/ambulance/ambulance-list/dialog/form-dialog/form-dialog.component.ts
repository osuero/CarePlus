import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AmbulanceListService } from '../../ambulance-list.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AmbulanceList } from '../../ambulance-list.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

export interface DialogData {
  id: number;
  action: string;
  ambulanceList: AmbulanceList;
}

@Component({
    selector: 'app-ambulance-list-form',
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
        MatRadioModule,
        MatDatepickerModule,
        MatDialogClose,
    ]
})
export class AmbulanceListFormComponent {
  action: string;
  dialogTitle: string;
  ambulanceListForm: UntypedFormGroup;
  ambulanceList: AmbulanceList;

  constructor(
    public dialogRef: MatDialogRef<AmbulanceListFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public ambulanceListService: AmbulanceListService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.dialogTitle =
      this.action === 'edit'
        ? 'Vehicle No: ' + data.ambulanceList.vehicle_no
        : 'Add Ambulance Call';
    this.ambulanceList =
      this.action === 'edit' ? data.ambulanceList : new AmbulanceList({}); // Create a blank object
    this.ambulanceListForm = this.createAmbulanceListForm();
  }

  // Create form group for ambulance list details
  createAmbulanceListForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.ambulanceList.id],
      vehicle_no: [this.ambulanceList.vehicle_no, Validators.required],
      vehicle_name: [this.ambulanceList.vehicle_name, Validators.required],
      year_made: [this.ambulanceList.year_made, Validators.required],
      driver_name: [this.ambulanceList.driver_name, Validators.required],
      driver_license_no: [this.ambulanceList.driver_license_no],
      driver_no: [this.ambulanceList.driver_no],
      vehicle_type: [this.ambulanceList.vehicle_type, Validators.required],
      note: [this.ambulanceList.note],
    });
  }

  // Dynamic error message retrieval
  getErrorMessage(controlName: string): string {
    const control = this.ambulanceListForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    return '';
  }

  // Submit form data
  submit() {
    if (this.ambulanceListForm.valid) {
      const ambulanceListData = this.ambulanceListForm.getRawValue();
      if (this.action === 'edit') {
        this.ambulanceListService
          .updateAmbulanceList(ambulanceListData)
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
        this.ambulanceListService
          .addAmbulanceList(ambulanceListData)
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
