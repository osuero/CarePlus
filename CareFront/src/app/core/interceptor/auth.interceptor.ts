import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../service/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const bearer = this.tokenService.getBearerToken();

    if (!bearer) {
      return next.handle(req);
    }

    const authRequest = req.clone({
      setHeaders: {
        Authorization: bearer,
      },
    });

    return next.handle(authRequest);
  }
}
