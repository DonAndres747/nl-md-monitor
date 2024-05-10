import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { ClientModel } from '../model/client.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  logMess: string = '';
  error: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private clientModel: ClientModel
  ) {}

  ngOnInit(): void {
    const allCookies: { [key: string]: string } = this.cookieService.getAll();

    for (const cookieName in allCookies) {
      this.clientModel.clear();
      if (allCookies.hasOwnProperty(cookieName)) {
        this.cookieService.delete(cookieName);
      }
    }
  }

  onSubmit() {
    this.authenticationService
      .loginAuthentication(this.username, this.password)
      .subscribe((resp) => {
        resp == '4'
          ? ((this.error = true),
            (this.logMess = 'credenciales invalidas'),
            setTimeout(() => {
              this.error = false;
              this.logMess = '';
            }, 2000))
          : resp == '5'
          ? ((this.error = true),
            (this.logMess = 'Error inesperado'),
            setTimeout(() => {
              this.error = false;
              this.logMess = '';
            }, 2000),
            alert('Error inesperado'))
          : '';
      });
  }

  onEnterKeyPress(event: any) {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }
}
