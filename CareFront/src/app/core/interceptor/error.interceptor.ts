import { AuthService } from "../service/auth.service";
import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly publicAuthEndpoints = [
    "/api/auth/login",
    "/api/auth/setup-password",
  ];

  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          const isPublicAuthRequest = this.publicAuthEndpoints.some((endpoint) =>
            request.url.includes(endpoint)
          );

          if (!isPublicAuthRequest) {
            // auto logout if 401 response returned from api on protected endpoints
            this.authenticationService.logout();
            location.reload();
          }
        }

        const error = err?.error?.message || err.statusText || err;
        return throwError(() => error);
      })
    );
  }
}
