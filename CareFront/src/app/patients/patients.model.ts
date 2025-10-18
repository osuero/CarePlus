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
}

export interface Country {
  code: string;
  name: string;
}
