import { Component, HostListener } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(
    private _auth: AuthService, 
    private _router: Router) {
    parent.postMessage({loaded: true}, "*");
  }

  @HostListener('window:message', ['$event'])
  public onAppLoaded({origin, data}: any) {
    if (data.cmd && data.cmd == "token"){
      this._auth.setSession(data.token);
      this._router.navigate(['/kiosks']);
    }
  }

}


