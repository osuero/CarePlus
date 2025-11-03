import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import {
  Appointment,
  AppointmentCollection,
  AppointmentMetadata,
  AppointmentStatus,
  SaveAppointmentRequest,
} from './appointments.model';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');
  private readonly appointmentsUrl = `${this.baseUrl}/api/appointments`;
  private readonly defaultTenant = environment.tenantId ?? 'default';

  constructor(private readonly http: HttpClient) {}

  searchAppointments(
    page: number,
    pageSize: number,
    options?: {
      search?: string | null;
      patientId?: string | null;
      doctorId?: string | null;
      status?: AppointmentStatus | 'ALL' | null;
      fromUtc?: string | null;
      toUtc?: string | null;
      tenantId?: string | null;
    }
  ): Observable<AppointmentCollection> {
    const tenantId = options?.tenantId ?? this.defaultTenant;
    let params = new HttpParams()
      .set('page', String(Math.max(page, 1)))
      .set('pageSize', String(Math.max(pageSize, 1)));

    if (options?.search && options.search.trim().length > 0) {
      params = params.set('search', options.search.trim());
    }

    if (options?.patientId && options.patientId !== 'ALL') {
      params = params.set('patientId', options.patientId);
    }

    if (options?.doctorId && options.doctorId !== 'ALL') {
      params = params.set('doctorId', options.doctorId);
    }

    if (options?.status && options.status !== 'ALL') {
      params = params.set('status', options.status);
    }

    if (options?.fromUtc) {
      params = params.set('fromUtc', options.fromUtc);
    }

    if (options?.toUtc) {
      params = params.set('toUtc', options.toUtc);
    }

    return this.http
      .get<AppointmentCollection>(this.appointmentsUrl, {
        params,
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getAppointment(
    id: string,
    tenantId: string = this.defaultTenant
  ): Observable<Appointment> {
    return this.http
      .get<Appointment>(`${this.appointmentsUrl}/${id}`, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getAppointmentsForRange(
    fromUtc: string,
    toUtc: string,
    tenantId: string = this.defaultTenant
  ): Observable<Appointment[]> {
    let params = new HttpParams()
      .set('fromUtc', fromUtc)
      .set('toUtc', toUtc);

    return this.http
      .get<Appointment[]>(`${this.appointmentsUrl}/calendar`, {
        params,
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getMetadata(tenantId: string = this.defaultTenant): Observable<AppointmentMetadata> {
    return this.http
      .get<AppointmentMetadata>(`${this.appointmentsUrl}/metadata`, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  createAppointment(
    request: SaveAppointmentRequest,
    tenantId: string = this.defaultTenant
  ): Observable<Appointment> {
    const payload: SaveAppointmentRequest = {
      ...request,
      tenantId,
    };

    return this.http
      .post<Appointment>(this.appointmentsUrl, payload, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateAppointment(
    id: string,
    request: SaveAppointmentRequest,
    tenantId: string = this.defaultTenant
  ): Observable<Appointment> {
    const payload: SaveAppointmentRequest = {
      ...request,
      tenantId,
    };

    return this.http
      .put<Appointment>(`${this.appointmentsUrl}/${id}`, payload, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  cancelAppointment(
    id: string,
    tenantId: string = this.defaultTenant
  ): Observable<void> {
    return this.http
      .post<void>(`${this.appointmentsUrl}/${id}/cancel`, {}, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteAppointment(
    id: string,
    tenantId: string = this.defaultTenant
  ): Observable<void> {
    return this.http
      .delete<void>(`${this.appointmentsUrl}/${id}`, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private createHeaders(includeTenant: boolean, tenantId?: string): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (includeTenant && tenantId) {
      headers = headers.set('X-Tenant-ID', tenantId);
    }

    return headers;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      return throwError(() => new Error(error.error.message));
    }

    if (error.error) {
      try {
        const payload = error.error as ApiErrorResponse;
        if (payload?.message) {
          return throwError(() => new Error(payload.message));
        }
      } catch (parseError) {
        console.error('Failed to parse error response', parseError);
      }
    }

    return throwError(
      () => new Error('No fue posible procesar la solicitud. Intenta nuevamente.')
    );
  }
}
