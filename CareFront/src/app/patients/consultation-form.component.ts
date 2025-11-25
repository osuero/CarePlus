import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ConsultationsApiService } from './consultations-api.service';
import {
  ConsultationDetail,
  CreateConsultationRequest,
  SymptomEntryDto,
  UpdateConsultationRequest,
} from './consultations.model';
import { DoctorSummary } from './patients.model';

export interface ConsultationFormData {
  patientId: string;
  doctors: DoctorSummary[];
  consultation?: ConsultationDetail;
}

export interface ConsultationFormResult {
  consultation?: ConsultationDetail;
}

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './consultation-form.component.html',
  styleUrls: ['./consultation-form.component.scss'],
})
export class ConsultationFormComponent {
  readonly form: FormGroup;
  readonly editing: boolean;
  errorMessage = '';
  saving = false;

  get symptoms(): FormArray<FormGroup> {
    return this.form.get('symptoms') as FormArray<FormGroup>;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly consultationsApi: ConsultationsApiService,
    private readonly dialogRef: MatDialogRef<ConsultationFormComponent, ConsultationFormResult>,
    @Inject(MAT_DIALOG_DATA) public data: ConsultationFormData
  ) {
    this.editing = !!data.consultation;
    this.form = this.fb.group({
      consultationDateTime: new FormControl(
        data.consultation?.consultationDateTime
          ? new Date(data.consultation.consultationDateTime)
          : '',
        { validators: this.editing ? [] : [Validators.required] }
      ),
      doctorId: new FormControl(
        data.consultation?.doctorId ?? '',
        this.editing ? [] : [Validators.required]
      ),
      reasonForVisit: new FormControl(
        data.consultation?.reasonForVisit ?? '',
        [Validators.required, Validators.maxLength(512)]
      ),
      notes: new FormControl(data.consultation?.notes ?? ''),
      symptoms: this.fb.array<FormGroup>([]),
    });

    if (data.consultation?.symptoms?.length) {
      data.consultation.symptoms.forEach((symptom) => this.addSymptom(symptom));
    } else {
      this.addSymptom();
    }

    if (this.editing) {
      this.form.get('doctorId')?.disable();
      this.form.get('consultationDateTime')?.disable();
    }
  }

  addSymptom(symptom?: SymptomEntryDto): void {
    this.symptoms.push(
      this.fb.group({
        description: new FormControl(symptom?.description ?? '', [Validators.required, Validators.maxLength(512)]),
        onsetDate: new FormControl(symptom?.onsetDate ? new Date(symptom.onsetDate) : ''),
        severity: new FormControl(symptom?.severity ?? null),
        additionalNotes: new FormControl(symptom?.additionalNotes ?? '', [Validators.maxLength(1000)]),
      })
    );
  }

  removeSymptom(index: number): void {
    this.symptoms.removeAt(index);
    if (this.symptoms.length === 0) {
      this.addSymptom();
    }
  }

  save(): void {
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payloadSymptoms = this.symptoms.value
      .filter((symptom) => (symptom?.description ?? '').toString().trim().length > 0)
      .map<SymptomEntryDto>((symptom) => ({
        description: symptom.description?.toString().trim() ?? '',
        onsetDate: symptom.onsetDate ? new Date(symptom.onsetDate).toISOString() : null,
        severity: symptom.severity === null ? null : Number(symptom.severity),
        additionalNotes: symptom.additionalNotes?.toString().trim() || null,
      }));

    if (this.editing && this.data.consultation) {
      const request: UpdateConsultationRequest = {
        reasonForVisit: this.form.get('reasonForVisit')?.value?.toString().trim() ?? '',
        notes: this.form.get('notes')?.value?.toString().trim() || null,
        symptoms: payloadSymptoms,
      };

      this.consultationsApi
        .update(this.data.consultation.id, request)
        .subscribe({
          next: (consultation) => {
            this.saving = false;
            this.dialogRef.close({ consultation });
          },
          error: (error: Error) => {
            this.errorMessage = error.message;
            this.saving = false;
          },
        });
      return;
    }

    const request: CreateConsultationRequest = {
      patientId: this.data.patientId,
      doctorId: this.form.get('doctorId')?.value,
      consultationDateTime: new Date(
        this.form.get('consultationDateTime')?.value
      ).toISOString(),
      reasonForVisit: this.form.get('reasonForVisit')?.value?.toString().trim() ?? '',
      notes: this.form.get('notes')?.value?.toString().trim() || null,
      symptoms: payloadSymptoms,
    };

    this.consultationsApi.create(request).subscribe({
      next: (consultation) => {
        this.saving = false;
        this.dialogRef.close({ consultation });
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.saving = false;
      },
    });
  }
}
