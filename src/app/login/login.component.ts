import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  ngOnInit(): void {
    //this.onSubmit();
  }

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  onSubmit() {
    this.authenticationService.loginAuthentication(this.username, this.password).subscribe({
      next: (result) => {
        console.log(result);
        if (result == '1') {
          console.log("Ganadores!");
          this.router.navigate(['/main']);
        }else{
          console.log("llorar!");
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
