import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router'; 
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers;

        const token = this.authService.getToken();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        const clonedReq = headers !== req.headers ? req.clone({ headers }) : req;

        return next.handle(clonedReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    console.log('Unauthorized - logging out');
                    this.authService.logout();
                }
                return throwError(() => error);
            })
        );
    }

}
