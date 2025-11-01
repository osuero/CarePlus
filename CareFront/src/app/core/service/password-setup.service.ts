import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PasswordSetupInfo {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isPasswordConfirmed: boolean;
}

export interface CompletePasswordSetupRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class PasswordSetupService {
  constructor(private readonly http: HttpClient) {}

  getInfo(token: string): Observable<PasswordSetupInfo> {
    const params = new HttpParams().set('token', token);
    return this.http.get<PasswordSetupInfo>(
      `${environment.apiUrl}/api/auth/setup-password`,
      { params }
    );
  }

  complete(request: CompletePasswordSetupRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/auth/setup-password`, request);
  }
}
