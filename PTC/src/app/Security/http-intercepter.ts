import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable,NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import {HTTP_INTERCEPTORS } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
  })
export class HttpRequestInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var token = localStorage.getItem("bearerToken");
        if (token) {
            const newreq = req.clone(
                {
                    headers: req.headers.set('Authorization', 'Bearer '+ token)
                }
            )
            return next.handle(newreq);
        }
        else{
            return next.handle(req);
        }
    }

}

@NgModule({
    providers:[
        {
            provide:HTTP_INTERCEPTORS,
            useClass: HttpRequestInterceptor,
            multi:true
        }
    ]
})
export class HttpInterceptorModel{}