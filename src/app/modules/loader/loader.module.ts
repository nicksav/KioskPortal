import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './loader.component';
import { LoaderRoutingModule } from './loader.routing';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    LoaderRoutingModule,
    MatProgressSpinnerModule
  ],
  declarations: [ LoaderComponent ]
})
export class LoaderModule { }
