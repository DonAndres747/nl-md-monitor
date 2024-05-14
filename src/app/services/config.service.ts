import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import * as properties from '../../../properties.json';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private http: HttpClient) {}

  transactions: any[] = [];

  getConnectionsUrls(dbName: string, connectionId: string): Observable<any> {
    const urlLogin: string = `http://${properties.services.host}:${properties.services.port}/db/connections`;

    const body = { dbName, connectionId };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(urlLogin, body, { headers }).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  updateConnections(
    solId: string,
    serviceVal: string,
    urls: Object
  ): Observable<any> {
    const urlLogin: string = `http://${properties.services.host}:${properties.services.port}/db/updateConnections`;

    const body = { solId, serviceVal, urls };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<any>(urlLogin, body, { headers }).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let err = '';
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
      err = '5';
    } else {
      console.log('Respuesta:', error.error.message);
      err = '4';
    }
    return err;
  }
}
