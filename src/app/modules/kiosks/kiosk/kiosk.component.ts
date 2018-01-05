import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { remove } from 'lodash';

import { ApiService } from '../../../api/api.service';
import { BaseComponent } from '../../shared/helpers/base.component';
import { KioskObserverService } from './kiosk-observer.service';
import { KioskForm } from './kiosk-form.config';
import { PairKioskForm } from './kiosk-form.config';
import { AclService } from '../../../auth/acl.service';
import { AuthService } from '../../../auth/auth.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  // Pair Modal
  public modalOptions;
  public modalRef;
  @ViewChild('pairModal') private pairModal;
  @ViewChild('successPairModal') private successPairModal;
  @ViewChild('errorPairModal') private errorPairModal;

  constructor(public acl: AclService,
              private _api: ApiService,
              private _formBuilder: FormBuilder,
              private _observer: KioskObserverService,
              private _modalService: NgbModal,
              private _route: ActivatedRoute,
              private _auth: AuthService,) {
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

  public pairKioskModal() {
    this.modalOptions = {
      type: 'kiosk',
      title: 'Pair Kiosk',
      successMessage: 'Kiosk has been successfully paired!',
      successButton: 'Pair'
    };
    this.form = this._formBuilder.group(PairKioskForm);
    this.modalRef = this._modalService.open(this.pairModal);
    this.modalRef.result.then(
      () => {
        this.form.reset();
      },
      () => {
        this.form.reset();
      }
    );
  }

  public submitForm() {
    if (this.form.valid) {
      let data = Object.assign({}, this.form.value);
      this.isLoading = true;
      data = this.newPairData(data);
      let request = this._api.kiosk.pairKiosk(data);
      let sub = request
        .subscribe(
          (res) => {
            this._observer.emit(this.modalOptions.type, res);
            this.modalRef.close();
            this.modalRef = null;
            this.isLoading = false;
            sub.unsubscribe();
            this.openPairModalTemplate({'title': 'Pair Success', 'content': `The Kiosk "${this.selectedKiosk['name']}" has been successfully paired!`});
          },
          (err) => {
            this.modalRef.close();
            this.modalRef = null;
            this.isLoading = false;
            this.openPairModalTemplate({'title': 'Pair Error', 'content': 'Error occurred. Please try again.'});
          }
        );
    }
  }

  private newPairData(data) {
    const newData = {
      'pairingCode': data.code,
      'kioskId': this.selectedKiosk['id'],
      'token': this._auth.getToken()
    }
    return newData;
  }

  openPairModalTemplate(data) {
    this.modalOptions = {
      type: 'kiosk',
      title: data['title'],
      data: data['content']
    };
    this.modalRef = this._modalService.open(this.successPairModal);
    this.modalRef.result.then(
      () => {
        this.form.reset();
      },
      () => {
        this.form.reset();
      }
    );
  }

}
