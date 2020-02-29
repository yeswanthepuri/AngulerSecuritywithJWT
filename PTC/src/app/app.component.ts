import { Component } from '@angular/core';
import { AppUserAuth } from './Security/app-User-auth';
import { SecurityService } from './Security/security.service';

@Component({
  selector: 'ptc-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title: string = "Krithvika Land of Fun";
  securityObject: AppUserAuth = null;
  constructor(private securityService: SecurityService) {
    this.securityObject = securityService.securityObject;
  }
  logOut() {
    this.securityService.logOut();
  }
}
