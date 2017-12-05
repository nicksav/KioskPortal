import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseComponent } from './modules/shared/helpers/base.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  extends BaseComponent {
  title = 'app';

  constructor(
    private _router: Router) {
      super();
  }

}


