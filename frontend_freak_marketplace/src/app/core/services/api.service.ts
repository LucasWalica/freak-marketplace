import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:80/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    // Con cookies JWT, no necesitamos enviar el token en el header
    // Las cookies se envían automáticamente con cada request
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return headers;
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
      params: httpParams
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getHeaders()
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  upload<T>(endpoint: string, formData: FormData): Observable<T> {
    // Con cookies JWT, no necesitamos enviar el token en el header
    // Las cookies se envían automáticamente con cada request
    let headers = new HttpHeaders();

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData, {
      headers
    });
  }
}
