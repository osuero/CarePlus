import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import {
  Country,
  DoctorSummary,
  Patient,
  PatientCollection,
  RegisterPatientRequest,
} from './patients.model';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

interface GraphQLPatientsResponse {
  data?: {
    getPatients: PatientCollection;
  };
  errors?: Array<{ message?: string }>;
}

interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleName?: string | null;
}

interface UserCollectionResponse {
  nodes: UserSummary[];
}

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');
  private readonly patientsUrl = `${this.baseUrl}/api/patients`;
  private readonly graphqlUrl = `${this.baseUrl}/graphql`;
  private readonly defaultTenant = environment.tenantId ?? 'default';

  constructor(private readonly http: HttpClient) {}

  getPatients(
    page: number,
    pageSize: number,
    search?: string | null,
    gender?: string | null,
    country?: string | null,
    tenantId: string = this.defaultTenant
  ): Observable<PatientCollection> {
    const query = `
      query GetPatients(
        $page: Int!,
        $pageSize: Int!,
        $search: String,
        $gender: String,
        $country: String
      ) {
        getPatients(
          page: $page,
          pageSize: $pageSize,
          search: $search,
          gender: $gender,
          country: $country
        ) {
          nodes {
            id
            tenantId
            firstName
            lastName
            email
            phoneNumber
            identification
            country
            gender
            dateOfBirth
            age
            createdAtUtc
            updatedAtUtc
            assignedDoctorId
            assignedDoctorName
          }
          totalCount
          page
          pageSize
          totalPages
          hasNextPage
          hasPreviousPage
        }
      }
    `;

    const variables: Record<string, unknown> = {
      page,
      pageSize,
      search: search?.trim() || null,
      gender: gender?.trim() || null,
      country: country?.trim() || null,
    };

    return this.http
      .post<GraphQLPatientsResponse>(
        this.graphqlUrl,
        {
          query,
          variables,
        },
        {
          headers: this.createHeaders(true, tenantId),
        }
      )
      .pipe(
        map((response) => {
          if (response.errors?.length) {
            const message =
              response.errors
                .map((err) => err.message)
                .filter((msg): msg is string => !!msg)
                .join(', ') || 'No fue posible obtener la lista de pacientes.';
            throw new Error(message);
          }

          const payload = response.data?.getPatients;
          if (!payload) {
            throw new Error('No fue posible obtener la lista de pacientes.');
          }

          return payload;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  registerPatient(
    request: RegisterPatientRequest,
    tenantId: string = this.defaultTenant
  ): Observable<Patient> {
    const payload: RegisterPatientRequest = {
      ...request,
      tenantId,
    };

    return this.http
      .post<Patient>(`${this.patientsUrl}/register`, payload, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  updatePatient(
    id: string,
    request: RegisterPatientRequest,
    tenantId: string = this.defaultTenant
  ): Observable<Patient> {
    const payload: RegisterPatientRequest = {
      ...request,
      tenantId,
    };

    return this.http
      .put<Patient>(`${this.patientsUrl}/${id}`, payload, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  deletePatient(
    id: string,
    tenantId: string = this.defaultTenant
  ): Observable<void> {
    return this.http
      .delete<void>(`${this.patientsUrl}/${id}`, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  searchCountries(search?: string): Observable<Country[]> {
    let params = new HttpParams();
    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }

    return this.http
      .get<Country[]>(`${this.patientsUrl}/countries`, {
        params,
        headers: this.createHeaders(false),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  searchDoctors(
    tenantId: string = this.defaultTenant,
    search?: string
  ): Observable<DoctorSummary[]> {
    let params = new HttpParams()
      .set('page', '1')
      .set('pageSize', '100')
      .set('role', 'Doctor');

    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }

    return this.http
      .get<UserCollectionResponse>(`${this.baseUrl}/api/users/`, {
        params,
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(
        map((response) => response?.nodes ?? []),
        map((users) =>
          users
            .filter((user) =>
              (user.roleName ?? '').toLowerCase() === 'doctor'
            )
            .map((user) => ({
              id: user.id,
              fullName: [user.firstName, user.lastName]
                .filter((part) => !!part && part.trim().length > 0)
                .map((part) => part.trim())
                .join(' '),
              email: user.email,
            }))
        ),
        map((doctors) => {
          const unique = new Map<string, DoctorSummary>();
          doctors.forEach((doctor) => {
            if (!unique.has(doctor.id)) {
              unique.set(doctor.id, {
                ...doctor,
                fullName:
                  doctor.fullName.length > 0
                    ? doctor.fullName
                    : doctor.email,
              });
            }
          });
          return Array.from(unique.values()).sort((a, b) =>
            a.fullName.localeCompare(b.fullName)
          );
        }),
        catchError((error) => this.handleError(error))
      );
  }

  private handleError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      const backendPayload = error.error as
        | ApiErrorResponse
        | { title?: string; detail?: string }
        | string
        | null
        | undefined;

      if (backendPayload && typeof backendPayload === 'object') {
        const apiError = backendPayload as ApiErrorResponse & {
          detail?: string;
          title?: string;
        };
        const message =
          apiError.message || apiError.error || apiError.detail || apiError.title;

        if (message) {
          return throwError(() => new Error(message));
        }
      }

      if (typeof backendPayload === 'string' && backendPayload.trim().length > 0) {
        return throwError(() => new Error(backendPayload));
      }

      if (error.message) {
        return throwError(() => new Error(error.message));
      }
    }

    if (error instanceof Error) {
      return throwError(() => error);
    }

    return throwError(
      () => new Error('Ocurrió un error inesperado al comunicarse con el servidor.')
    );
  }

  private createHeaders(
    includeTenant = true,
    tenantId: string = this.defaultTenant
  ): HttpHeaders {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (includeTenant && tenantId) {
      headers['X-Tenant-Id'] = tenantId;
    }

    return new HttpHeaders(headers);
  }
}
