export interface Patient {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  identification?: string | null;
  country?: string | null;
  gender: string;
  dateOfBirth: string;
  age: number;
  createdAtUtc: string;
  updatedAtUtc: string;
  assignedDoctorId?: string | null;
  assignedDoctorName?: string | null;
}

export interface PatientCollection {
  nodes: Patient[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RegisterPatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  identification?: string | null;
  country?: string | null;
  gender: string;
  dateOfBirth: string;
  tenantId?: string;
  assignedDoctorId?: string | null;
}

export interface Country {
  code: string;
  name: string;
}

export interface DoctorSummary {
  id: string;
  fullName: string;
  email: string;
}
