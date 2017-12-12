import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LaddaModule } from 'angular2-ladda';
import { QuillModule } from 'ngx-quill';

import { SharedModule } from '../shared/shared.module';
import { KiosksComponent } from './kiosks.component';
import { routes } from './kiosks.routing';
import { KioskObserverService } from './kiosk/kiosk-observer.service';
import { KioskGridComponent } from './grid/kiosk-grid.component';
import { KioskComponent } from './kiosk/kiosk.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    LaddaModule,
    QuillModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    KiosksComponent, 
    KioskGridComponent, 
    KioskComponent
  ],
  providers: [
    KioskObserverService
  ]
})
export class KiosksModule { }
