import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { environment } from './../../../environments/environment';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

  constructor() { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({ url: `${environment.baseUrl}${request.url}` });
    return next.handle(request);
  }

}
