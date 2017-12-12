import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { remove } from 'lodash';

import { ApiService } from '../../../api/api.service';
import { BaseComponent } from '../../shared/helpers/base.component';
import { KioskObserverService } from './kiosk-observer.service';
import { KioskForm } from './kiosk-form.config';
import { AclService } from '../../../auth/acl.service';

@Component({
  selector: 'kiosk-page',
  templateUrl: './kiosk.component.html',
  styleUrls: ['./kiosk.component.css']
})
export class KioskComponent extends BaseComponent implements OnInit {

  public selectedKiosk;
  public tab;
  public isLoading = false;
  public form: FormGroup;
  public quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
  
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
  
      ['link', 'image']                                  // link and image, video
    ]
  };

  constructor(public acl: AclService,
              private _api: ApiService,
              private _formBuilder: FormBuilder,
              private _observer: KioskObserverService,
              private _route: ActivatedRoute) { 
    super();
    this.form = this._formBuilder.group(KioskForm);
    this.selectedKiosk = _observer.storage;
    this.tab = 'locations';
    this.editMode = false;
  }

  public get editMode() {
    return this._observer.editMode$;
  }

  public set editMode(value: any) {
    this._observer.emit('editMode', value);
  }

  public ngOnInit() {
    if (!this.selectedKiosk) {
      this.subs = this._route.params.subscribe(params => {
        let id = params['id'];
        this._observer.emit('storage', {id});
        this.subs = this._api.kiosk.getOne(id).subscribe((kiosk) => {
          this._observer.emit('storage', kiosk);
          this.selectedKiosk = kiosk;
          this.form.patchValue(this.selectedKiosk);
          this.tab = 'locations';
        });
      });
    } else {
      this.form.patchValue(this.selectedKiosk);
    }
  }

  public save() {
    if (this.form.valid) {
      let data = Object.assign({}, this.form.value);
      let {id} = data;
      delete data['id'];
      this.isLoading = true;

      let sub = this._api.kiosk.update(id, data)
        .finally(() => {
          this.isLoading = false;
          sub.unsubscribe();
        })
        .subscribe(
          (res) => {
            this.selectedKiosk = res;
            //this._toastr.success('kiosk has been updated');
          },
          (err) => {
            let {userMessage} = JSON.parse(err._body);
            if (userMessage) {
              //this._toastr.error(userMessage);
            }
          }
        );
    }
  }

}
