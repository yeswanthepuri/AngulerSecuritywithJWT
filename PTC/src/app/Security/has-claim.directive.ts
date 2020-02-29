import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { SecurityService } from './security.service';

@Directive({
  selector: '[hasClaim]'
})
export class HasClaimDirective {

  constructor(private securityService: SecurityService,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>) { }

  @Input() set hasClaim(claimType: any) {
    if (this.securityService.hasClaim(claimType)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainerRef.clear();
    }
  }

}
