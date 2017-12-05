import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { remove } from 'lodash';

import { ApiService } from '../../../api/api.service';
import { BaseComponent } from '../../shared/helpers/base.component';
import { LocationObserverService } from './location-observer.service';
import { AclService } from '../../../auth/acl.service';

@Component({
  selector: 'cat-page',
  templateUrl: './location.component.html',
})

export class LocationComponent extends BaseComponent implements OnInit {

  public selectedLocation;
  public tab;
  public isLoading = false;
  constructor(public acl: AclService,
              private _api: ApiService,
              private _observer: LocationObserverService,
              private _route: ActivatedRoute) {

    super();
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
          this.tab = 'kiosks';
        });
      });
    }
  }

  public save() {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

}

