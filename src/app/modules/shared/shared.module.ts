import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';

import { DpTableModule } from './dp-table';
import { SearchInputComponent } from './search-input/search-input.component';


@NgModule({
  providers: [],
  imports: [
    CommonModule,
    DpTableModule,
    LaddaModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule
  ],
  declarations: [
    SearchInputComponent
  ],
  exports: [
    DpTableModule,
    SearchInputComponent
  ]
})

export class SharedModule {
}
