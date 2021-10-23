import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AppInterceptorService implements HttpInterceptor {
  constructor(private route: Router, private authService: AuthService) { }

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // set auth token for outgoing requests
    if (httpRequest instanceof HttpRequest) {
      const accessToken = this.authService.getAccessToken();
      if (accessToken) {
        httpRequest = httpRequest.clone({ setHeaders: { authorization: accessToken } });
        console.log(httpRequest.headers.get('authorization'));
      }
    }

    return next.handle(httpRequest).pipe(map((event) => {
      // Get headers in incoming response
      if (event instanceof HttpResponse) {
        let accessToken: string;
        if (event.headers.has('X-Access')) {
          accessToken = event.headers.get('X-Access');
        } else if (event.headers.has('X-Refresh-Access')) {
          accessToken = event.headers.get('X-Refresh-Access');
        } else {
          accessToken = '';
        }

        if (accessToken) { this.authService.updateAccessToken(accessToken); }
      }
      return event;
    })).pipe(catchError((error: HttpErrorResponse, caught: Observable<HttpEvent<any>>) => {
      if (error.error instanceof ErrorEvent) {
        // Client Error
        console.log(error);
      } else {
        // Server Error
        console.log(error);
        switch (error.status) {
          case 401:
            // unauthorized
            this.authService.clearAccessToken();
            this.route.navigate(['/login']);
            break;
        }
      }
      return caught;
    }));
  }
}
