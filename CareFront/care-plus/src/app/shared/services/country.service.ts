import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Country } from '../models/country.model';
import { TenantService } from './tenant.service';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly baseUrl = `${environment.apiUrl}/api/users/countries`;

  constructor(
    private readonly http: HttpClient,
    private readonly tenantService: TenantService
  ) {}

  search(query?: string | null): Observable<Country[]> {
    let params = new HttpParams();

    if (query && query.trim().length > 0) {
      params = params.set('search', query.trim());
    }

    const headers = new HttpHeaders({
      'X-Tenant-Id': this.tenantService.currentTenant
    });

    return this.http.get<Country[]>(this.baseUrl, { params, headers });
  }
}
