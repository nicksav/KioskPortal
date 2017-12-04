import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {

    let parserUrl = document.createElement('a');
    parserUrl.href = window.location.href;
    let origin = `${parserUrl.protocol}//${parserUrl.host}`;
    window.addEventListener("message", this.recevedTokenMessage, false);
    parent.postMessage({loaded: true}, origin);
  }

  public recevedTokenMessage(event){
    debugger;
  }
}


