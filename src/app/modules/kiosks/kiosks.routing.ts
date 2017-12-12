import { Routes } from '@angular/router';
import { KiosksComponent } from './kiosks.component';
import { KioskComponent } from './kiosk/kiosk.component';

import { Guard } from '../../auth/guard.service';

export const routes: Routes = [
  {
    path: '',
    component: KiosksComponent,
    canActivate: [Guard],
    children: [
      {path: ':id', component: KioskComponent}
    ]
  }
];
