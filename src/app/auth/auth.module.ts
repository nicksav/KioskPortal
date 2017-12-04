import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { Guard } from './guard.service';
import { AclService } from './acl.service';

@NgModule({
  imports: [],
  providers: [
    AuthService,
    Guard,
    AclService
  ],
})
export class AuthModule {
}
