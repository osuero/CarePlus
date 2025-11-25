export interface SymptomEntryDto {
  description: string;
  onsetDate?: string | null;
  severity?: number | null;
  additionalNotes?: string | null;
}

export interface ConsultationListItem {
  id: string;
  consultationDateTime: string;
  doctorName: string;
  reasonForVisit: string;
  symptomSummary: string;
}

export interface ConsultationDetail {
  id: string;
  patientId: string;
  patientFullName: string;
  doctorId: string;
  doctorName: string;
  consultationDateTime: string;
  reasonForVisit: string;
  notes?: string | null;
  symptoms: SymptomEntryDto[];
}

export interface PagedConsultationResponse {
  items: ConsultationListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface CreateConsultationRequest {
  patientId: string;
  doctorId: string;
  consultationDateTime: string;
  reasonForVisit: string;
  notes?: string | null;
  symptoms: SymptomEntryDto[];
}

export interface UpdateConsultationRequest {
  reasonForVisit: string;
  notes?: string | null;
  symptoms: SymptomEntryDto[];
}
