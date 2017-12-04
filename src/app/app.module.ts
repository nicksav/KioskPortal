import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LoaderModule } from  './modules/loader/loader.module'
import { AuthModule } from './auth/auth.module'
import { ApiModule } from './api/api.module'
import { AppRoutingModule } from './app-routing.module';
import { LocalStorageModule } from 'angular-2-local-storage';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LoaderModule,
    ApiModule,
    AppRoutingModule,
    AuthModule,
    LocalStorageModule.withConfig({
      prefix: 'kioskportal-app',
      storageType: 'localStorage'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
