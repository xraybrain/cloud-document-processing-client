import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { ProgressService } from "./progress.service";

@Injectable()
export class AppInterceptorService implements HttpInterceptor {
  constructor(
    private route: Router,
    private authService: AuthService,
    private progressService: ProgressService
  ) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // set auth token for outgoing requests
    if (httpRequest instanceof HttpRequest) {
      const accessToken = this.authService.getAccessToken();
      if (accessToken) {
        httpRequest = httpRequest.clone({
          // setHeaders: { authorization: accessToken },
          setParams: { authorization: accessToken },
        });
      }
    }

    return next
      .handle(httpRequest)
      .pipe(
        map((event) => {
          // Get headers in incoming response
          if (event instanceof HttpResponse) {
            let accessToken: string;
            if (event.headers.has("X-Access")) {
              accessToken = event.headers.get("X-Access");
              console.log("x-access", accessToken);
            } else if (event.headers.has("X-Refresh")) {
              accessToken = event.headers.get("X-Refresh");
              console.log("x-access-refresh", accessToken);
            } else {
              accessToken = "";
            }

            if (accessToken) {
              this.authService.updateAccessToken(accessToken);
            }
          }
          if (
            event.type === HttpEventType.UploadProgress ||
            event.type === HttpEventType.DownloadProgress
          ) {
            console.log(event);
            this.progressService.progress(
              Math.round((100 * event.loaded) / event.total)
            );
          }
          return event;
        })
      )
      .pipe(
        catchError(
          (error: HttpErrorResponse, caught: Observable<HttpEvent<any>>) => {
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
                  location.href = "/login";
                  break;
              }
            }
            return throwError(caught);
          }
        )
      );
  }
}
