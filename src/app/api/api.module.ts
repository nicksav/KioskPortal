import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiService } from './api.service';
import { BaseUrlInterceptor, ServerErrorsInterceptor, TokenInterceptor,  PaginationIntercepter, DeleteResponseInterceptor } from './interceptors';

import { KioskService } from './kiosk.service';
import { LocationService } from './location.service';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    ApiService,
    KioskService,
    LocationService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: DeleteResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: PaginationIntercepter, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorsInterceptor, multi: true },
  ]
})
export class ApiModule { }
