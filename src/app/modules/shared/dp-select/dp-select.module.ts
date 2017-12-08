import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectModule } from 'ng2-select';

import { DpSelectComponent } from './dp-select.component';


@NgModule({
  imports: [
    CommonModule,
    SelectModule,
  ],
  exports: [DpSelectComponent],
  declarations: [DpSelectComponent],
  providers: [],
})
export class DpSelectModule {
}


