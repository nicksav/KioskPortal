import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LaddaModule } from 'angular2-ladda';

import { LocationsComponent } from './locations.component';
import { LocationComponent } from './location/location.component';
import { routes } from './locations.routing';
import { LocationObserverService } from './location/location-observer.service';
import { LocationGridComponent } from './grid/location-grid.component';
import { SharedModule } from '../shared/shared.module';
import { LocationKiosksComponent } from './kiosks/location-kiosks.component';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    LaddaModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [],
  declarations: [
    LocationsComponent,
    LocationGridComponent,
    LocationComponent,
    LocationKiosksComponent
  ],
  providers: [
    LocationObserverService
  ]
})
export class LocationsModule {
}
