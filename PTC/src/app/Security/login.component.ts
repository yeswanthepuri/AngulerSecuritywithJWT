import { Component, OnInit } from '@angular/core';
import { AppUserAuth } from './app-User-auth';
import { AppUser } from './app-User';
import { SecurityService } from './security.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'ptc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  securityObject: AppUserAuth;
  user: AppUser;
  redirectUrl: string;
  constructor(private securityService: SecurityService,
    private route: ActivatedRoute,
    private router: Router) {
    this.securityObject = securityService.securityObject;
  }


  login() {
    this.securityService.login(this.user)
      .subscribe(resp => this.securityObject = resp, () => { this.securityObject = new AppUserAuth() });
    if (this.redirectUrl != "") {
      this.router.navigateByUrl(this.redirectUrl);
    }
  }
  ngOnInit() {
    this.securityObject = null;
    this.user = new AppUser()
    this.redirectUrl = this.route.snapshot.queryParamMap.get("redirectUrl");
  }

}
