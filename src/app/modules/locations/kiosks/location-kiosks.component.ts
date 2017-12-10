import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';

import { ApiService } from '../../../api/api.service';
import { BaseComponent } from '../../shared/helpers/base.component';
import { LocationObserverService } from '../location/location-observer.service';
import { AclService } from '../../../auth/acl.service';
import { LocationKiosksForm } from './location-kiosks-form.config';

const columnsConfig = [
  {
    key: 'name',
    title: 'Locatrion Name',
  },{
    key: 'screenName',
    title: 'Screen Name',
  },{
    key: 'kioskPhoneNumber',
    title: 'Phone Number',
  }
];

@Component({
  selector: 'location-kiosks',
  templateUrl: './location-kiosks.component.html',
  styleUrls: ['./location-kiosks.component.css']
})
export class LocationKiosksComponent extends BaseComponent implements OnInit {
  private searchSub: Subscription;
  private search = new HttpParams().set('limit', '10').set('offset', '0');
  public currentPage = 1;
  public isLoading = false;
  public form: FormGroup;
  public kiosks = [];
  public allKiosks;
  public collectionSize: number;
  public settings: any;
  public modalOptions = {
    type: 'kiosk',
    title: 'Link Kiosk to Location',
    successMessage: 'The Kiosk has been linked',
    successButton: 'Link'
  };
  
  private _locationId;
  private _deleteData;
  private _modalRef;
  
  public get editMode() {
    return this._observer.editMode$;
  }

  @ViewChild('unlinkConfirmModal') private unlinkConfirmModal;
  @ViewChild('linkModal') private linkModal;

  constructor(public acl: AclService,
              private _api: ApiService,
              private _formBuilder: FormBuilder,
              private _observer: LocationObserverService,
              private _modalService: NgbModal) {
    super();
    this._locationId = _observer.storage.id;
    this._loadItems();
    this.searchKiosks();

    this.editMode.subscribe((value) => {
      this.settings = {
        columns: columnsConfig,
        showActions: value,
        actions: [
          {name: 'icon-trash', callback: 'onConfirmUnlink'}
        ]
      };
    });

    this._observer.kiosks$.subscribe( res => {
      const limit = +this.search.get('limit');
      let offset = +this.search.get('offset');

      let lastPage = Math.ceil(this.collectionSize / limit);
      let itemsOnPage = this.collectionSize % limit || limit;
      if (itemsOnPage < 10 && this.currentPage == lastPage) {
        this.collectionSize += 1;
        this.kiosks.push(res);
      } else {
        this.search.set('offset', String(offset + lastPage * limit));
        this._loadItems(this.search);
      }
    });
  }

  ngOnInit() {
  }

  public onConfirmUnlink(event) {
    this._deleteData = event;
    this._modalRef = this._modalService.open(this.unlinkConfirmModal);
    this._modalRef.result
      .then(() => {
      }, () => {
      })
      .then(() => {
        this._modalRef = null;
        this._deleteData = null;
      });
  }

  public onLink() {
    this.form = this._formBuilder.group(LocationKiosksForm);
    this.form.get('locationId').setValue(this._locationId);
    this._modalRef = this._modalService.open(this.linkModal);
    this._modalRef.result.then(
      () => {
        this._resetSearch();
      },
      () => {
        this._resetSearch();
      }
    );
  }

  public onActionClick(event) {
    this[event.callback](event.row);
  }
  
  public onSelectItem(event) {
    console.log();
    this.form.get('id').setValue(event.id);
  }

  public unlinkKiosk() {
    let {id} = this._deleteData;
    this.isLoading = true;
    let sub = this._api.location
      .deleteKioskFromLocation(this._locationId, id)
      .finally(() => {
        sub.unsubscribe();
        this.isLoading = false;
      })
      .subscribe(
        () => {
          const limit = +this.search.get('limit');
          let offset = +this.search.get('offset');
          this._modalRef.close();
          this.collectionSize -= 1;
          if (this.collectionSize && !(this.collectionSize % limit)) {
            this.search.set('offset', String(offset - limit));
          }
          this._loadItems(this.search);
        },
        (err) => {
          let {userMessage} = JSON.parse(err._body);
          if (userMessage) {
            //this._toastr.error(userMessage);
          }
        }
      );
  }

  public linkKiosk() {
    if (this.form.valid) {
      let data = Object.assign({}, this.form.value);
      
      this.isLoading = true;
      let request = this._api.location.addKioskToLocation(data);
      let sub = request
        .finally(() => {
          this._modalRef = null;
          this.isLoading = false;
          sub.unsubscribe();
        })
        .subscribe(
        (res) => {
          this._observer.emit(this.modalOptions.type, res);
          this._modalRef.close()          
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

  public searchKiosks(searchValue: string = '') {
    const params = new HttpParams().set('offset', '0').set('text', searchValue);

    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
    
    this.subs = this.searchSub = this._api.kiosk
      .getList(params)
      .subscribe((res) => {
        this.allKiosks = res.data;
      });
  }

  private _resetSearch() {
    this.form.reset();   
    this.searchKiosks();
  }

  public onPageChange(event) {
    for (const [key, value] of Object.entries(event.search)) {
      this.search = this.search.set(key, value);
    }
    this._loadItems(this.search);
  }

  private _loadItems(locationId = this._locationId, params = this.search) {
    this._api.kiosk.getListByLocation(locationId, params)
      .finally(() => {
        //this.isSearching = false;
      })
      .take(1)
      .subscribe((res) => {
        let { total, data } = res;
        this.collectionSize = +total;
        this.kiosks = data;
        this.currentPage = (+params.get('offset') / 10) + 1;
      });
  }

}
