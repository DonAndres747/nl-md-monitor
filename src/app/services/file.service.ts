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

  updateProp(
    path: string,
    newContent: string,
    contentLine: number
  ): Observable<any> {
    const body = { filePath: path, newContent, contentLine };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<any>('http://localhost:3000/update-prop', body, { headers })
      .pipe(
        map((response) => {
          console.log('Respuesta del servidor:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  async getFile(): Promise<void> {
    try {
      // Solicitar al usuario que seleccione un archivo
      const [handle] = await (window as any).showOpenFilePicker();
      const file: File = await handle.getFile();

      // Leer el contenido del archivo como texto
      const contenido: string = await file.text();

      // Hacer algo con el contenido del archivo
      console.log(contenido);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }
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
