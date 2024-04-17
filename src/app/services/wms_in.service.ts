import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, elementAt, map, throwError } from 'rxjs';
import * as properties from '../../../properties.json';
import { WmsModel } from '../model/wms.model';

@Injectable({
  providedIn: 'root',
})
export class WmsService {
  constructor(private http: HttpClient, private wmsModel: WmsModel) {}

  urlLogin: string = `http://${properties.services.host}:${properties.services.port}/db/wms_in`;
  transactions: any[] = [];

  getWmsTrans(dbName: string): Observable<any> {
    const body = { dbName };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.urlLogin, body, { headers }).pipe(
      map((response) => {
        response.result.map((element: any, index: number) => {
          this.transactions[index] = new WmsModel();
          this.transactions[index].initialize(element);
        });

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
