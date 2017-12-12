import { Component, ViewChild, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd,  } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { remove } from 'lodash';

import { KioskForm } from './kiosk/kiosk-form.config';
import { ApiService } from '../../api/api.service';
import { BaseComponent } from '../shared/helpers/base.component';
import { KioskObserverService } from './kiosk/kiosk-observer.service';

@Component({
  selector: 'kiosks-page',
  templateUrl: './kiosks.component.html',
  styleUrls: ['./kiosks.component.css']
})
export class KiosksComponent extends BaseComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public modalRef;
  public form: FormGroup;
  public modalOptions;
  public selectedKiosk = {};
  public searchText = '';

  @ViewChild('deleteConfirmModal') private deleteConfirmModal;
  @ViewChild('createModal') private createModal;

  constructor(private _api: ApiService,
              private _formBuilder: FormBuilder,
              private _modalService: NgbModal,
              private _observer: KioskObserverService,
              private _router: Router,
              private _route: ActivatedRoute) {
    super();

    setTimeout(() => this.selectedKiosk = null);
    _router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/kiosks') {
        this.selectedKiosk = this._observer.storage = null;
      }
    });
    this.subs = _observer.storage$.subscribe((role) => {
      setTimeout(() => this.selectedKiosk = role);
    });
  }

  public ngOnInit() {
  }

  public onRoleCreate() {
    this.modalOptions = {
      type: 'kiosk',
      title: 'Create Kiosk',
      successMessage: 'Kiosk has been created',
      successButton: 'Add'
    };
    this.form = this._formBuilder.group(KioskForm);
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
    this.selectedKiosk = this._observer.storage = data;
    this._router.navigate([`${data.id}`], { relativeTo: this._route });
  }

  public submitForm() {
    if (this.form.valid) {
      let data = Object.assign({}, this.form.value);
      delete data['id'];
      this.isLoading = true;
      let request = this._api.kiosk.create(data);
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

  



  public ngOnDestroy() {
  }

}





