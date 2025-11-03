export type AppointmentStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'NoShow';

export interface Appointment {
  id: string;
  tenantId: string;
  patientId: string;
  patientName?: string | null;
  patientEmail?: string | null;
  doctorId?: string | null;
  doctorName?: string | null;
  title: string;
  description?: string | null;
  location?: string | null;
  startsAtUtc: string;
  endsAtUtc: string;
  status: AppointmentStatus;
  notes?: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface AppointmentCollection {
  nodes: Appointment[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AppointmentParticipant {
  id: string;
  name: string;
  email?: string | null;
}

export interface AppointmentMetadata {
  patients: AppointmentParticipant[];
  doctors: AppointmentParticipant[];
}

export interface SaveAppointmentRequest {
  tenantId?: string | null;
  patientId: string;
  doctorId?: string | null;
  title: string;
  description?: string | null;
  location?: string | null;
  startsAtUtc: string;
  endsAtUtc: string;
  status?: AppointmentStatus | null;
  notes?: string | null;
}
