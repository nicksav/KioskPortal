import { Component, EventEmitter, OnInit, Input, Output, forwardRef } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/auth.service'

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true
    }
  ]
})
export class FileUploaderComponent implements OnInit, ControlValueAccessor {
  @Input() label = 'File';
  @Input('value') _value;
  @Input('readOnly') readOnly;
  id: string;
  options: UploaderOptions = { 
    concurrency: 1
  };
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  uploadMessage = 'Drag and drop a file or choose manually';
  uploadError = '';
  noFile = true;
  onChange: any = () => { };
  onTouched: any = () => { };

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  constructor(private _auth: AuthService) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnTouched(fn) { 
    this.onTouched = fn;
  }

  onUploadOutput(output: UploadOutput): void {
    if (this.readOnly) return;
    switch (output.type) {
      case 'allAddedToQueue':
        const event: UploadInput = {
          type: 'uploadAll',
          url: `${environment.baseUrl}/setup/upload`,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this._auth.getToken()}`
          }
        };
        this.uploadInput.emit(event);
        break;
      case 'addedToQueue':
        // add file to array when added
        this.files.push(output.file); 
        break;
      case 'uploading':
        this.uploadMessage = 'Uploading...';
        // update current data in files array for uploading file
        const index = this.files.findIndex(file => file.id === output.file.id);
        this.files[index] = output.file;
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
      case 'dragOver':
        this.dragOver = true;
      case 'dragOut':
        this.dragOver = false;
      case 'drop':
        this.dragOver = false;
      case 'done':
        if (output && output['file'] && output['file']['response']) {
          this.value = output['file']['response'];
        } else {
          this.uploadError = 'Error occured, please try again.';
        }
        break;
    }
  }

}
