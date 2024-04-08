import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient) {}

  modificarArchivo(
    rutaArchivo: string,
    nuevoContenido: string,
    solNum: number
  ): Observable<any> {
    const body = {
      ruta: rutaArchivo,
      newContent: nuevoContenido,
      solNum: solNum,
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>('http://localhost:3000/modificar-archivo', body, { headers })
      .pipe(
        map((response) => {
          console.log('Respuesta del servidor:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getWar(
    path: string,
    newContent: string,
    contentLine: number
  ): Observable<any> {
    const body = { filePath: path, newContent, contentLine };
    console.log('body enviado al servidor:', body);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>('http://localhost:3000/archivo-war', body, { headers })
      .pipe(
        map((response) => {
          console.log('Respuesta del servidor:', response);
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
    return throwError(
      'Error al modificar el archivo. Por favor, intenta nuevamente.'
    );
  }
}
