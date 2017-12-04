import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { environment } from './../../../environments/environment';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

  constructor(
    // @Inject('CookieService') private _cookie: CookieService
  ) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!request.url.includes("api.cognitive.microsoft.com"))
      request = request.clone({ url: `${environment.baseUrl}${request.url}` });

    return next.handle(request);
  }

}
