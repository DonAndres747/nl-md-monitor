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

    this.clientModel.clear();
    return this.http.post<any>(this.urlLogin, body, { headers }).pipe(
      map((response) => {
        this.clientModel.setClientId(response.clientId);
        this.clientModel.setUser(response.user);
        this.clientModel.setDbName(response.dbName);
        this.clientModel.setConnectionUrl(response.connectionUrl);
        this.clientModel.setUserName(response.userName);

        this.isLogged = true;

        this.getConnectionsAll(response.dbName).subscribe(() => {
          const expirationDate = new Date();
          expirationDate.setHours(expirationDate.getHours() + 1);
          this.cookieService.set('token', 'true', expirationDate);

          this.router.navigate(['/main']);

          return response;
        });
      }),
      catchError(this.handleError)
    );
  }

  getConnectionsAll(dbName: string): Observable<any> {
    const urlLogin: string = `http://${properties.services.host}:${properties.services.port}/db/connectionsAll`;

    const body = { dbName };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(urlLogin, body, { headers }).pipe(
      map((response) => {
        response.forEach((element: any) => {
          switch (element.id) {
            case 'wms': {
              const key = element.service != null && element.service != '';
              this.clientModel.setWmsKey(key.toString());
              break;
            }
            case 'tep': {
              const key = element.service != null && element.service != '';
              this.clientModel.setTep(key.toString());
              break;
            }
            case 'sap': {
              const key = element.service != null && element.service != '';
              this.clientModel.setSapKey(key.toString());
              break;
            }
          }
        });
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let resp = '';
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
      resp = '5';
    } else {
      resp = '4';
    }

    return resp;
  }

  isLoggedIn(): Boolean {
    const token = this.cookieService.get('token') === 'true';
    return token;
  }
}
