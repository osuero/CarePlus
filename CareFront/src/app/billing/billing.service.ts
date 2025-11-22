import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  BillingCollection,
  BillingRecord,
  BillingSearchOptions,
  CreateBillingRequest,
  InsuranceProviderSummary,
  PaymentMethod,
} from './billing.model';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');
  private readonly billingUrl = `${this.baseUrl}/api/v1/billing`;
  private readonly defaultTenant = environment.tenantId ?? 'default';

  constructor(private readonly http: HttpClient) {}

  searchBilling(
    page: number,
    pageSize: number,
    options?: BillingSearchOptions
  ): Observable<BillingCollection> {
    const tenantId = options?.tenantId ?? this.defaultTenant;
    let params = new HttpParams()
      .set('page', String(Math.max(1, page)))
      .set('pageSize', String(Math.max(1, pageSize)));

    if (options?.dateFrom) {
      params = params.set('dateFrom', options.dateFrom);
    }
    if (options?.dateTo) {
      params = params.set('dateTo', options.dateTo);
    }
    if (options?.patientId) {
      params = params.set('patientId', options.patientId);
    }
    if (options?.doctorId) {
      params = params.set('doctorId', options.doctorId);
    }
    if (options?.paymentMethod !== null && options?.paymentMethod !== undefined) {
      const methodName = PaymentMethod[options.paymentMethod];
      params = params.set('paymentMethod', methodName);
    }
    if (options?.insuranceProviderId) {
      params = params.set('insuranceProviderId', options.insuranceProviderId);
    }

    return this.http
      .get<BillingCollection>(this.billingUrl, {
        params,
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getBilling(
    id: string,
    tenantId: string = this.defaultTenant
  ): Observable<BillingRecord> {
    return this.http
      .get<BillingRecord>(`${this.billingUrl}/${id}`, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  createBilling(
    request: CreateBillingRequest,
    tenantId: string = this.defaultTenant
  ): Observable<BillingRecord> {
    const payload: CreateBillingRequest = {
      ...request,
      tenantId: tenantId ?? request.tenantId,
    };

    return this.http
      .post<BillingRecord>(this.billingUrl, payload, {
        headers: this.createHeaders(true, tenantId),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  listInsuranceProviders(
    tenantId: string = this.defaultTenant
  ): Observable<InsuranceProviderSummary[]> {
    return this.http
      .get<InsuranceProviderSummary[]>(`${this.billingUrl}/providers`, {
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
        console.error('Failed to parse billing API error', parseError);
      }
    }

    return throwError(
      () =>
        new Error('No fue posible obtener la informacion de facturacion. Intenta nuevamente.')
    );
  }
}
