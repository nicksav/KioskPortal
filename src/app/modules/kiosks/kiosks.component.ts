import { Component, OnInit, ViewEncapsulation, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../api/index';
import { BaseComponent } from '../shared/helpers/base.component';

@Component({
  selector: 'kiosks-app',
  templateUrl: './kiosks.component.html',
  styleUrls: ['./kiosks.component.scss'],
})
export class KiosksComponent extends BaseComponent implements OnInit {

  constructor(
      api: ApiService,  
      private _router: Router) {

        super();

  }

  ngOnInit() {
    console.log("loaded kiosks component");
  }

}
