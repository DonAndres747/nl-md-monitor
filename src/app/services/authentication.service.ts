import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  urlLogin: string = 'http://localhost:9000/nl/auth';
  constructor(private httpClient: HttpClient) {}

  loginAuthentication(username: string, password: string) {
    const body = { "usr_id": username, "password": password };
    return this.httpClient.post(this.urlLogin, body);
  }
}
