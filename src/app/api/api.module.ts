import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiService } from './api.service';
import { BaseUrlInterceptor, ServerErrorsInterceptor, TokenInterceptor } from './interceptors';

import { KioskService } from './kiosk.service';

@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    ApiService,
    KioskService,
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ]
})
export class ApiModule { }
