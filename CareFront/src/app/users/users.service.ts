import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Country, RegisterUserRequest, Role, User, UserCollection } from './users.model';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

interface GraphQLRolesResponse {
  data?: {
    getRoles: {
      nodes: Role[];
    };
  };
  errors?: Array<{ message?: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');
  private readonly usersUrl = `${this.baseUrl}/api/users`;
  private readonly graphqlUrl = `${this.baseUrl}/graphql`;
  private readonly defaultTenant = environment.tenantId ?? 'default';

  constructor(private readonly http: HttpClient) { }

  getUsers(
    page: number,
    pageSize: number,
    search?: string | null,
    tenantId: string = this.defaultTenant
  ): Observable<UserCollection> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }

    return this.http
      .get<UserCollection>(this.usersUrl, {
        params,
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  registerUser(
    request: RegisterUserRequest,
    tenantId: string = this.defaultTenant
  ): Observable<User> {
    const payload: RegisterUserRequest = {
      ...request,
      tenantId,
    };

    alert(this.usersUrl)
    console.log(tenantId)
    console.log('este es el payload', payload)
    alert(payload)
    return this.http
      .post<User>(`${this.usersUrl}/register`, payload, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateUser(
    id: string,
    request: RegisterUserRequest,
    tenantId: string = this.defaultTenant
  ): Observable<User> {
    const payload: RegisterUserRequest = {
      ...request,
      tenantId,
    };

    return this.http
      .put<User>(`${this.usersUrl}/${id}`, payload, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteUser(id: string, tenantId: string = this.defaultTenant): Observable<void> {
    return this.http
      .delete<void>(`${this.usersUrl}/${id}`, {
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
      .get<Country[]>(`${this.usersUrl}/countries`, {
        params,
        headers: this.createHeaders(false),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getRoles(tenantId?: string, includeGlobal = true): Observable<Role[]> {
    const normalizedTenant = tenantId?.toString().trim() || this.defaultTenant;

    const query = `
      query GetRoles($includeGlobal: Boolean!) {
        getRoles(page: 1, pageSize: 100, includeGlobal: $includeGlobal) {
          nodes {
            id
            tenantId
            name
            description
            isGlobal
          }
        }
      }
    `;

    return this.http
      .post<GraphQLRolesResponse>(
        this.graphqlUrl,
        {
          query,
          variables: {
            includeGlobal,
          },
        },
        {
          headers: this.createHeaders(true, normalizedTenant),
        }
      )
      .pipe(
        map((response) => {
          if (response.errors?.length) {
            const message =
              response.errors
                .map((err) => err.message)
                .filter((msg): msg is string => !!msg)
                .join(', ') || 'No fue posible obtener la lista de roles.';
            throw new Error(message);
          }

          return response.data?.getRoles.nodes ?? [];
        }),
        catchError((error) => this.handleError(error))
      );
  }

  private handleError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      const backendPayload = error.error as ApiErrorResponse | { title?: string; detail?: string } | string | null | undefined;

      if (backendPayload && typeof backendPayload === 'object') {
        const apiError = backendPayload as ApiErrorResponse & { detail?: string; title?: string };
        const message =
          apiError.message ||
          apiError.error ||
          apiError.detail ||
          apiError.title;

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
      () => new Error('Ocurrio un error inesperado al comunicarse con el servidor.')
    );
  }

  private createHeaders(includeTenant = true, tenantId: string = this.defaultTenant): HttpHeaders {
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
