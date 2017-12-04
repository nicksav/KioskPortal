import { Component, OnInit, ViewEncapsulation, HostBinding, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../api/index';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'kiosks-app',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {

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

    ngOnInit() {
        console.log("loaded loader component");
    }

}
