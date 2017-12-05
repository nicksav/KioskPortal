import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ServerErrorsInterceptor implements HttpInterceptor {
  constructor(private _router: Router) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .catch((err: HttpErrorResponse) => {

        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('====================================');
          console.log(err);
          console.log('====================================');
          console.log('Server-side error occured.');
        }

        return this._handleError(err);
      });
  }

  private _handleError(err): Observable<any> {
    if (err.status >= 500) {
      this._handleServerError();
      return Observable.throw(null);
    }
    switch (err.status) {
      case 401:
        this._handleUnauthorized();
        break;
      case 404:
        this._handleNotFound();
        break;
      case 409:
        return Observable.throw(409);
      case 0:
        this._handleServerError();
        return Observable.throw(null);
      default:
        break;
    }
    return Observable.empty();
  }

  private _handleServerError() {
    //this._toastr.error('Something went wrong. Please, try a bit later');
  }

  private _handleUnauthorized() {
    this._router.navigate(['/']);
  }

  private _handleNotFound() {
    this._router.navigate(['/404']);
  }
}
