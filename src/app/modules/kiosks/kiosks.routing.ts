import { Routes } from '@angular/router';
import { KiosksComponent } from './kiosks.component';

import { Guard } from '../../auth/guard.service';

export const routes: Routes = [
  {
    path: '', component: KiosksComponent, canActivate: [Guard]
  }
];

