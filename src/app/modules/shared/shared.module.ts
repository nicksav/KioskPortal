import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';

import { DpTableModule } from './dp-table';
import { DpSelectModule } from './dp-select';
import { SearchInputComponent } from './search-input/search-input.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
  providers: [],
  imports: [
    CommonModule,
    DpTableModule,
    DpSelectModule,
    LaddaModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule
  ],
  declarations: [
    SearchInputComponent,
    ProgressBarComponent
  ],
  exports: [
    DpTableModule,
    DpSelectModule,
    SearchInputComponent,
    ProgressBarComponent
  ]
})

export class SharedModule {
}
