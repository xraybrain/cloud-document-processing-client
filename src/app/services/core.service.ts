import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import AppGlobal from '../models/appGlobal.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = new HttpHeaders().set('content-type', 'application/json').set('authorization', authService.getAccessToken());
  }

  getData<T>(apiURL: string): Observable<T> {
    return this.http.get<T>(
      `${AppGlobal.getBaseUrl()}${apiURL}}`,
    );
  }

  postData<T>(data: any, apiURL: string): Observable<T> {
    return this.http.post<T>(
      `${AppGlobal.getBaseUrl()}${apiURL}`,
      data,
    );
  }

  postUploadData<T>(
    data: any,
    apiURL: string
  ): Observable<T> {
    return this.http.post<T>(
      `${AppGlobal.getBaseUrl()}${apiURL}`,
      data,
    );
  }

  putData<T>(data: any, apiURL: string): Observable<T> {
    return this.http.put<T>(`${AppGlobal.getBaseUrl()}${apiURL}`, data);
  }

  deleteData<T>(id: number, apiURL: string): Observable<T> {
    const httpOptions = {
      headers: this.headers,
      body: {
        id,
      },
    };
    return this.http.delete<T>(`${AppGlobal.getBaseUrl()}${apiURL}`, httpOptions);
  }
}
