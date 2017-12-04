import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelper } from 'angular2-jwt';
import { LocalStorageService } from 'angular-2-local-storage';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthService implements CanActivate {

    constructor (
        private _localStorageService: LocalStorageService
    ) 
    {

    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.fetchKioskProfile() != null;
    }

    
    public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return (this.canActivate(route, state));
    }

    public getToken(): string {
        return this._localStorageService.get('token');
    }

    public isAuthenticated(): boolean {
        let jwtHelper: JwtHelper = new JwtHelper();  
        const token = this.getToken();
        if (token == null)
            return false;
        else 
            return !jwtHelper.isTokenExpired(token);
    }

    public fetchKioskProfile() {
        let token: string = this._localStorageService.get("token");
        if (token) {
            let jwtHelper: JwtHelper = new JwtHelper();
            if (jwtHelper.isTokenExpired(token))
                return null;

            return jwtHelper.decodeToken(token);
        } else 
            return null;
    }

    public setSession(token){
        let jwtHelper: JwtHelper = new JwtHelper();
        let profile = jwtHelper.decodeToken(token);
        this._localStorageService.set("token", token);
        return profile;
    }
}