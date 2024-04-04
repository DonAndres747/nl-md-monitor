import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  urlLogin: string = 'http://localhost:9000/nl/14';
  constructor(private httpClient: HttpClient) {}

  loginAuthentication(): Observable<any>{
    return this.httpClient.get(this.urlLogin).pipe(res => res);
  }
}
