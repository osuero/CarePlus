export interface User {
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
  roleId?: string | null;
  roleName?: string | null;
}

export interface UserCollection {
  nodes: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  identification?: string | null;
  country?: string | null;
  gender: string;
  dateOfBirth: string;
  tenantId?: string;
  roleId?: string | null;
}

export interface Country {
  code: string;
  name: string;
}

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  isGlobal: boolean;
}
