import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import * as properties from '../../../properties.json';
import { Router } from '@angular/router';
import { ClientModel } from '../model/client.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  /*   urlLogin: string = 'http://localhost:9000/nl/auth';
  constructor(private httpClient: HttpClient) {}

  loginAuthentication(username: string, password: string) {
    const body = { "usr_id": username, "password": password };
    return this.httpClient.post(this.urlLogin, body);
  } */

  constructor(
    private http: HttpClient,
    private router: Router,
    private clientModel: ClientModel,
    private cookieService: CookieService
  ) {}

  isLogged: boolean = false;
  urlLogin: string = `http://${properties.services.host}:${properties.services.port}/api/login`;

  loginAuthentication(username: string, password: string): Observable<any> {
    const body = { usr_id: username, password: password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.urlLogin, body, { headers }).pipe(
      map((response) => {
        this.clientModel.setClientId(response.clientId);
        this.clientModel.setUser(response.user);
        this.clientModel.setDbName(response.dbName);
        this.clientModel.setConnectionUrl(response.connectionUrl);
        this.clientModel.setUserName(response.userName);

        this.isLogged = true;

        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
        this.cookieService.set('token', 'true', expirationDate); 

        this.router.navigate(['/main']);

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
    this.isLogged = false;
    return throwError('Error al autenticar las credenciales.');
  }

  isLoggedIn(): Boolean {
    // return this.isLogged;
    const token = this.cookieService.get('token') === 'true';
    return token;
  }
}
