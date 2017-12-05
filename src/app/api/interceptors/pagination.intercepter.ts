import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class PaginationIntercepter implements HttpInterceptor {
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .map((event: any) => {
        const { headers, body } = event;
        if (event instanceof HttpResponse && headers.has('X-Total-Count')) {
          const total = +headers.get('X-Total-Count');
          event = event.clone({ body: { total, data: body } });
        }
        return event;
      });
  }
}
