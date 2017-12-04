import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { AuthService } from '../auth/auth.service'
import { environment } from './../../environments/environment';
import { aclConfig } from './acl.config';

@Injectable()
export class AclService {
  public _aclConfig: any;

  private get _permissions() {
    let jwtHelper: JwtHelper = new JwtHelper();  
    let decodedToken = jwtHelper.decodeToken(this._auth.getToken());
    let claims = decodedToken[environment.permissionClaims];

    console.log(claims);

    return claims || [];
  }

  constructor(private _router: Router,
    private _auth: AuthService) {
    this._aclConfig = aclConfig;
  }

  public isAllow(key) {
    if (!this._auth.isAuthenticated()) {
      this._router.navigate(['/']);
      return false;
    }

     return this._permissions.includes(key);
  }

  public getKeyByUrl(url: string) {

    for (let route in this._aclConfig.routes) {
      if (this._aclConfig.routes.hasOwnProperty(route) && url.includes(route)) {
        return this._aclConfig.routes[route];
      }
    }
    return '';
  }
}
