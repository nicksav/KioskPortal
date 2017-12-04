import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './kiosks.routing';
import { KiosksComponent } from './kiosks.component';
import { MatTabsModule } from '@angular/material/tabs'

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ KiosksComponent ]
})
export class KiosksModule { }
