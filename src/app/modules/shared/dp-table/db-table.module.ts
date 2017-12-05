import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { DpTableComponent } from './dp-table.component';

@NgModule({
  imports: [
    CommonModule,
    NgbPaginationModule,
    NgbTooltipModule,
  ],
  exports: [DpTableComponent],
  declarations: [DpTableComponent],
  providers: [],
})
export class DpTableModule {
}
