import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApperrorinterceptorService implements HttpInterceptor {

  constructor(private route: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error: HttpErrorResponse, caught: Observable<HttpEvent<any>>) => {
      if (error.error instanceof ErrorEvent) {
        // Client Error
        console.log(error);
      } else {
        // Server Error
        console.log(error);
        switch (error.status) {
          case 401:
            // unauthorized
            this.route.navigate(['/login']);
            break;
        }
      }
      return caught;
    }));
  }
}
