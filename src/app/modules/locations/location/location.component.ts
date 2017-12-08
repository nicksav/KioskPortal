import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { remove } from 'lodash';

import { ApiService } from '../../../api/api.service';
import { BaseComponent } from '../../shared/helpers/base.component';
import { LocationObserverService } from './location-observer.service';
import { LocationForm } from './location-form.config';
import { AclService } from '../../../auth/acl.service';

@Component({
  selector: 'cat-page',
  templateUrl: './location.component.html',
})

export class LocationComponent extends BaseComponent implements OnInit {

  public selectedLocation;
  public tab;
  public isLoading = false;
  public form: FormGroup;
  constructor(public acl: AclService,
              private _api: ApiService,
              private _formBuilder: FormBuilder,
              private _observer: LocationObserverService,
              private _route: ActivatedRoute) {

    super();
    this.form = this._formBuilder.group(LocationForm);
    this.selectedLocation = _observer.storage;
    this.tab = 'kiosks';
    this.editMode = false;
  }

  public get editMode() {
    return this._observer.editMode$;
  }

  public set editMode(value: any) {
    this._observer.emit('editMode', value);
  }

  public ngOnInit() {
    if (!this.selectedLocation) {
      this.subs = this._route.params.subscribe(params => {
        let id = params['id'];
        this._observer.emit('storage', {id});
        this.subs = this._api.location.getOne(id).subscribe((location) => {
          this._observer.emit('storage', location);
          this.selectedLocation = location;
          this.form.patchValue(this.selectedLocation);
          this.tab = 'kiosks';
        });
      });
    } else {
      this.form.patchValue(this.selectedLocation);
    }
  }

  public save() {
    if (this.form.valid) {
      let data = Object.assign({}, this.form.value);
      let {id} = data;
      delete data['id'];
      this.isLoading = true;

      let sub = this._api.location.update(id, data)
        .finally(() => {
          this.isLoading = false;
          sub.unsubscribe();
        })
        .subscribe(
          (res) => {
            this.selectedLocation = res;
            //this._toastr.success('Location has been updated');
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

