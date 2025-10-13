import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RegisterUserRequest, UserResponse } from '../models/user.model';
import { TenantService } from './tenant.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/api/users`;

  constructor(
    private readonly http: HttpClient,
    private readonly tenantService: TenantService
  ) {}

  registerUser(payload: RegisterUserRequest): Observable<UserResponse> {
    const headers = new HttpHeaders({
      'X-Tenant-Id': this.tenantService.currentTenant
    });

    return this.http.post<UserResponse>(`${this.baseUrl}/register`, payload, { headers });
  }
}
