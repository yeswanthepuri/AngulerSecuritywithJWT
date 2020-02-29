import { Injectable } from '@angular/core';
import { AppUserAuth } from './app-User-auth';
import { AppUser } from './app-User';
import { Observable, of } from 'rxjs';
import { LOGIN_MOCK } from './login-Mock';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators/tap';

const API_URL = "https://localhost:5001/api/Security/";
const httpOptins = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  securityObject: AppUserAuth = new AppUserAuth();
  constructor(private http: HttpClient) { }

  login(entity: AppUser): Observable<AppUserAuth> {
    this.resetSecurityObject();

    // Object.assign(this.securityObject, LOGIN_MOCK.find(user => user.userName.toLowerCase() ===
    //   entity.userName.toLowerCase()));

    // if (this.securityObject.userName != "") {
    //   localStorage.setItem("bearerToken", this.securityObject.bearerToken);
    // }
    //return of<AppUserAuth>(this.securityObject);
    return this.http.post<AppUserAuth>(API_URL + "login", entity, httpOptins).pipe(
      tap(resp => {
        Object.assign(this.securityObject, resp);
        localStorage.setItem("bearerToken",
          this.securityObject.bearerToken);
      })
    );
  }

  logOut(): void {
    this.resetSecurityObject();
  }

  hasClaim(claimType: any, claimValue?: any) {
    return this.isClaimValid(claimType, claimValue);
  }


  private isClaimValid(claimType: string, claimValue?: string): boolean {
    let ret: boolean = false;
    let auth: AppUserAuth = null;

    auth = this.securityObject;

    if (auth) {
      if (claimType.indexOf(":") > 0) {
        let words: string[] = claimType.split(":");
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      }
      else {
        claimType = claimType.toLowerCase();

        claimValue = claimValue ? claimValue : "true";
      }
      ret = auth.claims.find(c => c.claimType.toLowerCase() == claimType && c.claimValue == claimValue) != null;
    }
    return ret;
  }
  resetSecurityObject(): void {
    this.securityObject.userName = "";
    this.securityObject.bearerToken = "";
    this.securityObject.isAuthenticated = false;
    this.securityObject.claims = [];
    // this.securityObject.canAccessProducts = false;
    // this.securityObject.canAddProduct = false;
    // this.securityObject.canSaveProduct = false;
    // this.securityObject.CanAccessCategories = false;
    // this.securityObject.canAddCategory = false;

    localStorage.removeItem("bearerToken");
  }
}
