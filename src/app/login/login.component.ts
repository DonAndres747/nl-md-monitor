import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationInterface } from '../interfaces/authentication.interface';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  listar: AuthenticationInterface[] = [];

  ngOnInit(): void {
    //this.onSubmit();
  }

  constructor(private authenticationService: AuthenticationService) { }

  onSubmit() {
    this.authenticationService.loginAuthentication().subscribe({
      next: (result) => {
        //console.log("EMartinez");
        console.log(result);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
