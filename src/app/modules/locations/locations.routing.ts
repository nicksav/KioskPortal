import { Routes } from '@angular/router';
import { LocationsComponent } from './locations.component';
import { LocationComponent } from './location/location.component';

import { Guard } from '../../auth/guard.service';

export const routes: Routes = [
  {
    path: '', 
    component: LocationsComponent, 
    canActivate: [Guard],
    children: [
      {path: ':id', component: LocationComponent}
    ]
  }
];

