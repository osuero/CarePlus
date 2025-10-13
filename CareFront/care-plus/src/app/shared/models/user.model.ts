export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  identification?: string | null;
  country?: string | null;
  gender: string;
  dateOfBirth: string;
}

export interface UserResponse {
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
}

export interface ApiError {
  error?: string;
  message?: string;
}

export interface UserCollectionResponse {
  nodes: UserResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UsersQueryVariables {
  page: number;
  pageSize: number;
  search?: string | null;
}

export interface UsersQueryResponse {
  data: {
    users: UserCollectionResponse;
  };
}
