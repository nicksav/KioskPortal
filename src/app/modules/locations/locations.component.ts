import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { remove } from 'lodash';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd,  } from '@angular/router';

import { LocationForm } from './location/location-form.config';
import { ApiService } from '../../api/api.service';
import { BaseComponent } from '../shared/helpers/base.component';
import { LocationObserverService } from './location/location-observer.service';

@Component({
  selector: 'locations-page',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})

export class LocationsComponent extends BaseComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public modalRef;
  public form: FormGroup;
  public modalOptions;
  public selectedLocation = {};
  public searchText = '';

  @ViewChild('deleteConfirmModal') private deleteConfirmModal;
  @ViewChild('createModal') private createModal;

  constructor(private _api: ApiService,
              private _formBuilder: FormBuilder,
              private _modalService: NgbModal,
              private _observer: LocationObserverService,
              private _router: Router,
              private _route: ActivatedRoute) {
    super();


    setTimeout(() => this.selectedLocation = null);
    _router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/locations') {
        this.selectedLocation = this._observer.storage = null;
      }
    });
    this.subs = _observer.storage$.subscribe((role) => {
      setTimeout(() => this.selectedLocation = role);
    });
  }
 
  public ngOnInit() {
  }

  public ngOnDestroy() {
}


  public onRoleCreate() {
    this.modalOptions = {
      type: 'location',
      title: 'Create Location',
      successMessage: 'Location has been created',
      successButton: 'Add'
    };
    this.form = this._formBuilder.group(LocationForm);
    this.modalRef = this._modalService.open(this.createModal);
    this.modalRef.result.then(
      () => {
        this.form.reset();
      },
      () => {
        this.form.reset();
      }
    );
  }

  public onSelectRow(data) {
    this.selectedLocation = this._observer.storage = data;
    this._router.navigate([`${data.id}`], { relativeTo: this._route });
  }

  public submitForm() {
    if (this.form.valid) {
      let data = Object.assign({}, this.form.value);
      delete data['id'];
      this.isLoading = true;
      let request = this._api.location.create(data);
      let sub = request
        .subscribe(
          (res) => {
            this._observer.emit(this.modalOptions.type, res);
            this.modalRef.close();
            this.modalRef = null;
            this.isLoading = false;
            sub.unsubscribe();
          },
          (err) => {
            let {userMessage} = JSON.parse(err._body);
            if (userMessage) {

            }
          }
        );
    }

  }
}

