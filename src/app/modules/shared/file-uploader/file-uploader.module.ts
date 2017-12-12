import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgUploaderModule } from 'ngx-uploader';

import { FileUploaderComponent } from './file-uploader.component';

@NgModule({
  imports: [
    CommonModule,
    NgUploaderModule
  ],
  declarations: [FileUploaderComponent],
  exports: [FileUploaderComponent]
})
export class FileUploaderModule { }
