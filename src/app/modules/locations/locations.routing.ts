import { Routes } from '@angular/router';
import { LocationsComponent } from './locations.component';

import { Guard } from '../../auth/guard.service';

export const routes: Routes = [
  {
    path: '', 
    component: LocationsComponent, 
    canActivate: [Guard],
    pathMatch: 'full'
  }
];

