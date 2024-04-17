import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import * as properties from '../../../properties.json';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private http: HttpClient) {}

  urlLogin: string = `http://${properties.services.host}:${properties.services.port}/db/connections`;
  transactions: any[] = [];

  getConnectionsUrls(dbName: string, connectionId: string): Observable<any> {
    const body = { dbName, connectionId };

    console.log(body);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.urlLogin, body, { headers }).pipe(
      map((response) => {  
        return response;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
    } else {
      console.log('Respuesta:', error.error.message);
    }
    return throwError('Error al autenticar las credenciales.');
  }
}
