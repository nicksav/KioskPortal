import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../api';
import { AuthService } from '../auth/auth.service'
import { AclService } from './acl.service';

@Injectable()
export class Guard implements CanActivate {

  constructor(private _api: ApiService,
              private _router: Router,
              private _acl: AclService,
              private _auth: AuthService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    debugger;
    const url: string = state.url;
    const key = this._acl.getKeyByUrl(url);
    return this.checkLogin(url) && this._checkAccess(key);
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    const key = this._acl.getKeyByUrl(url);

    return (this.canActivate(route, state) && this._checkAccess(key));
  }

  public checkLogin(url: string): boolean {

    if (this._auth.isAuthenticated()) {
      return true;
    }

    return false;
  }

  private _checkAccess(key) {
    return this._acl.isAllow(key) || false;
  }


}
