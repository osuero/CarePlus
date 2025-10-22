import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from '@core/models/interface';
import { LocalStorageService } from '@shared/services';
import { environment } from 'environments/environment';
import { Role } from '@core/models/role';

export interface LoginResult {
  user: User;
  token: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
  };
  status: number;
}

interface ApiLoginResponse {
  accessToken: string;
  expiresAtUtc: string;
  refreshToken?: string | null;
  user: ApiUserResponse;
}

interface ApiUserResponse {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  roleId?: string | null;
  roleName?: string | null;
  role?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
  isPasswordConfirmed: boolean;
}

const ROLE_TOKEN_MAP: Record<string, Role> = {
  admin: Role.Admin,
  administrator: Role.Admin,
  administrador: Role.Admin,
  doctor: Role.Doctor,
  medico: Role.Doctor,
  physician: Role.Doctor,
  patient: Role.Patient,
  paciente: Role.Patient,
};

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(protected http: HttpClient, private store: LocalStorageService) {}

  login(username: string, password: string, rememberMe = false): Observable<LoginResult> {
    const endpoint = `${environment.apiUrl}/api/auth/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Tenant-Id': environment.tenantId ?? 'default',
    });

    const payload = {
      email: username,
      password,
    };

    return this.http
      .post<ApiLoginResponse>(endpoint, payload, { headers })
      .pipe(
        map((response) => this.mapToLoginResult(response)),
        catchError((error: HttpErrorResponse) => {
          let message = 'Ha ocurrido un error al iniciar sesion.';

          if (error.status === 0) {
            message = 'No se pudo conectar con el servidor.';
          } else if (error.status === 401) {
            message = 'Correo o contrasena incorrectos.';
          } else if (error.status === 400) {
            message =
              (error.error?.message as string) ?? 'Solicitud de inicio invalida.';
          }

          return throwError(() => message);
        })
      );
  }

  refresh() {
    const currentUser = this.store.get('currentUser');
    if (!currentUser) {
      return throwError(() => 'No hay sesion activa');
    }

    const expiresAtUtc = this.store.get('tokenExpiresAtUtc');
    if (!expiresAtUtc) {
      return throwError(() => 'No hay informacion de expiracion del token.');
    }

    return throwError(() => 'La funcion de refresco no esta disponible aun.');
  }

  logout() {
    this.store.clear();
    return throwError(() => 'Sesion finalizada localmente.');
  }

  user() {
    return throwError(() => 'No implementado.');
  }

  private mapToLoginResult(response: ApiLoginResponse): LoginResult {
    const {
      accessToken,
      expiresAtUtc,
      refreshToken,
      user: apiUser,
    } = response;

    const roleResolution =
      this.resolveRole(apiUser.roleName) ??
      this.resolveRole(apiUser.role?.name) ??
      {
        name: Role.Admin,
        displayName: 'Administrador',
      };

    const mappedUser: User = {
      id: apiUser.id,
      tenantId: apiUser.tenantId,
      email: apiUser.email,
      firstName: apiUser.firstName,
      lastName: apiUser.lastName,
      name: `${apiUser.firstName} ${apiUser.lastName}`.trim(),
      roles: [
        {
          id: apiUser.roleId ?? apiUser.role?.id,
          name: roleResolution.name,
          displayName: roleResolution.displayName,
          priority: this.resolveRolePriority(roleResolution.name),
        },
      ],
      permissions: [],
      isPasswordConfirmed: apiUser.isPasswordConfirmed,
      roleId: apiUser.roleId,
      roleName: roleResolution.displayName,
    };

    const expiresInSeconds = this.calculateExpiresInSeconds(expiresAtUtc);

    return {
      user: mappedUser,
      token: {
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: expiresInSeconds,
        refresh_token: refreshToken ?? undefined,
      },
      status: 200,
    };
  }

  private calculateExpiresInSeconds(expiresAtUtc: string): number {
    const expiresAt = new Date(expiresAtUtc).getTime();
    const now = Date.now();
    const diff = Math.floor((expiresAt - now) / 1000);

    return diff > 0 ? diff : 0;
  }

  private resolveRole(rawRoleName: string | null | undefined):
    | { name: Role; displayName: string }
    | undefined {
    if (!rawRoleName) {
      return undefined;
    }

    const tokens = this.normalizeRoleTokens(rawRoleName);
    for (const token of tokens) {
      const mapped = ROLE_TOKEN_MAP[token];
      if (mapped) {
        return {
          name: mapped,
          displayName: this.toTitleCase(rawRoleName),
        };
      }
    }

    return undefined;
  }

  private normalizeRoleTokens(rawRoleName: string): string[] {
    return rawRoleName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z]/g, ' ')
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => token.length > 0);
  }

  private toTitleCase(value: string): string {
    if (!value) {
      return '';
    }

    return value
      .toLowerCase()
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private resolveRolePriority(roleName: Role): number {
    switch (roleName) {
      case Role.Admin:
        return 1;
      case Role.Doctor:
        return 2;
      case Role.Patient:
        return 3;
      default:
        return 99;
    }
  }
}
