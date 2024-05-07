import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../app/services/authentication.service';
import { ClientModel } from './model/client.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private clientModel: ClientModel
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const sol = route.paramMap.get('sol');

    const solution = sol
      ? sol == 'wms'
        ? this.clientModel.getWmsKey()
        : sol == 'tep'
        ? this.clientModel.getTepKey()
        : this.clientModel.getSapKey()
      : 'true';

    if (this.authService.isLoggedIn() && solution == 'true') {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
