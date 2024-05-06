import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ClientModel } from '../model/client.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, SidenavComponent, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private clientModel: ClientModel
  ) {}
  isCollapsed: boolean = false;

  onCollapsedChange(collapsed: boolean) {
    this.isCollapsed = collapsed;
  }

  logOut() {
    this.clearCookies();
    this.router.navigate(['/']);
  }

  clearCookies() {
    const allCookies: { [key: string]: string } = this.cookieService.getAll();
    for (const cookieName in allCookies) {
      this.clientModel.clear();
      if (allCookies.hasOwnProperty(cookieName)) {
        this.cookieService.delete(cookieName);
      }
    }
    // const allCookie2: { [key: string]: string } = this.cookieService.getAll();
    // console.log(allCookie2);
  }
}
