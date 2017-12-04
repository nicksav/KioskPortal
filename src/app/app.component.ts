import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {
    parent.postMessage({loaded: true}, "*");
  }

  @HostListener('window:message', ['$event'])
  public onAppLoaded({origin, data}: any) {
    if (data.cmd && data.cmd == "token"){
      console.log(data.token);
    }
  }

}


