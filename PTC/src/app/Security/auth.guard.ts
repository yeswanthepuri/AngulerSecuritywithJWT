import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private securityService: SecurityService,
    private router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let clainType = next.data["claimType"];

    if (this.securityService.securityObject.isAuthenticated &&
      this.securityService.securityObject[clainType]) {
      return true;
    }
    else {
      this.router.navigate(["Login"], 
      { queryParams: { redirectUrl: state.url } });
      return false;
    }

  }

}
