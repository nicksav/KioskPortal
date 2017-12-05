import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../api/api.service';
import { Location } from '../location';
import { LocationForm } from '../location/location-form.config';
import { BaseComponent } from '../../shared/helpers/base.component';
import { LocationObserverService } from '../location/location-observer.service';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';

const columnsConfig = [
  {
    key: 'name',
    title: 'Locatrion Name',
  },
  {
    key: 'locationKey',
    title: 'Location Key',
  }
];

@Component({
  selector: 'location-grid',
  templateUrl: './location-grid.component.html'
})

export class LocationGridComponent extends BaseComponent {

  private search = new HttpParams().set('limit', '10').set('offset', '0');

  public currentPage = 1;
  public isLoading = false;
  public isSearching = true;
  public collectionSize: number;
  public deleteData;
  public modalRef;
  public form: FormGroup;
  public locations: Location[] = [];
  public settings = {
    columns: columnsConfig,
    selectRow: true,
    actions: [
      { name: 'icon-trash', callback: 'onConfirmDelete' }
    ]
  };

  @Input() set searchText(text: string) {
    if (typeof text === 'string') {
      this.search = this.search.set('offset', '0');
      this.search = this.search.set('text', text);
      this._loadItems(this.search);
    }
  };

  @Output() public selectRow: EventEmitter<any> = new EventEmitter();

  @ViewChild('deleteConfirmModal') private deleteConfirmModal;

  constructor(private _api: ApiService,
    private _formBuilder: FormBuilder,
    private _observer: LocationObserverService,
    private _modalService: NgbModal) {

    super();

    this.form = this._formBuilder.group(LocationForm);
    this._observer.location$.subscribe((role) => {
      const limit = +this.search.get('limit');
      let offset = +this.search.get('offset');
      let lastPage = Math.ceil(this.collectionSize / limit);
      let itemsOnPage = this.collectionSize % limit || limit;
      if (itemsOnPage < 10 && this.currentPage == lastPage) {
        this.collectionSize += 1;
        this.locations.push(role);
      } else {
        offset += lastPage * limit;
        this.search.set('offset', String(offset));
        this._loadItems(this.search);
      }
    });
  }

  public onConfirmDelete(event) {
    this.deleteData = event;
    this.modalRef = this._modalService.open(this.deleteConfirmModal);
    this.modalRef.result
      .then(() => {
      }, () => {
      })
      .then(() => {
        this.modalRef = null;
        this.deleteData = null;
      });
  }

  public onActionClick(event) {
    this[event.callback](event.row);
  }

  public onDelete() {
    let { id } = this.deleteData;
    this.isLoading = true;
    let sub = this._api.location
      .deleteItem(id)
      .finally(() => {
        sub.unsubscribe();
        this.isLoading = false;
      })
      .subscribe(
      () => {
        const limit = +this.search.get('limit');
        let offset = +this.search.get('offset');
        this.modalRef.close();
        this.collectionSize -= 1;
        if (this.collectionSize && !(this.collectionSize % limit)) {
          offset -= limit;
          this.search.set('offset', String(offset));
        }
        this._loadItems(this.search);
      },
      (err) => {
        let { userMessage } = JSON.parse(err._body);
        if (userMessage) {

        }
      }
      );
  }

  public selectCountryItem(event) {
    this.form.get('country').setValue(event.id);
  }

  public onPageChange(event) {
    for (const [key, value] of Object.entries(event.search)) {
      this.search = this.search.set(key, value);
    }
    this.isSearching = true;
    this._loadItems(this.search);
  }

  public onSelectRow(event) {
    this.selectRow.emit(event);
  }

  private _loadItems(params = this.search) {
    this.isSearching = true;
    this._api.location.getList(params)
      .finally(() => {
        this.isSearching = false;
      })
      .take(1)
      .subscribe((res) => {
        let { total, data } = res;
        this.collectionSize = +total;
        this.locations = data.map(function (role) {
          return role;
        });
        this.currentPage = (+params.get('offset') / 10) + 1;
      });
  }
}
