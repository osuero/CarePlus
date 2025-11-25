import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ConsultationDetail,
  ConsultationListItem,
  CreateConsultationRequest,
  PagedConsultationResponse,
  UpdateConsultationRequest,
} from './consultations.model';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ConsultationsApiService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');
  private readonly consultationsUrl = `${this.baseUrl}/api/v1/consultations`;
  private readonly defaultTenant = environment.tenantId ?? 'default';

  constructor(private readonly http: HttpClient) {}

  getByPatient(
    patientId: string,
    page: number,
    pageSize: number,
    tenantId: string = this.defaultTenant
  ): Observable<PagedConsultationResponse> {
    let params = new HttpParams()
      .set('patientId', patientId)
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http
      .get<PagedConsultationResponse>(this.consultationsUrl, {
        params,
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getDetail(
    id: string,
    tenantId: string = this.defaultTenant
  ): Observable<ConsultationDetail> {
    return this.http
      .get<ConsultationDetail>(`${this.consultationsUrl}/${id}`, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  create(
    request: CreateConsultationRequest,
    tenantId: string = this.defaultTenant
  ): Observable<ConsultationDetail> {
    return this.http
      .post<ConsultationDetail>(this.consultationsUrl, request, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  update(
    id: string,
    request: UpdateConsultationRequest,
    tenantId: string = this.defaultTenant
  ): Observable<ConsultationDetail> {
    return this.http
      .put<ConsultationDetail>(`${this.consultationsUrl}/${id}`, request, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private createHeaders(includeTenant = true, tenantId: string = this.defaultTenant) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (includeTenant) {
      headers = headers.set('x-tenant-id', tenantId);
    }
    return headers;
  }

  private handleError(error: unknown): Observable<never> {
    let message = 'No fue posible completar la solicitud.';

    if (error && typeof error === 'object' && 'error' in error) {
      const apiError = (error as { error?: ApiErrorResponse }).error;
      if (apiError?.message) {
        message = apiError.message;
      }
    }

    return throwError(() => new Error(message));
  }
}
