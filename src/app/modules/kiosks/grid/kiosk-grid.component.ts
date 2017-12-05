import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../../api/api.service';
import { Kiosk } from '../kiosk';

import { KioskObserverService } from '../kiosk/kiosk-observer.service';
import { AclService } from '../../../auth/acl.service';

const columnsConfig = [
  {
    key: 'name',
    title: 'App Name',
  },
  {
    key: 'url',
    title: 'App URL',
  }
];

@Component({
  selector: 'kiosk-grid',
  templateUrl: './kiosk-grid.component.html'
})
export class KiosksGridComponent{

  private search = new HttpParams().set('limit', '10').set('offset', '0');

  public currentPage = 1;
  public isSearching = true;
  public isLoading = false;
  public collectionSize: number;
  public deleteData;
  public modalRef;
  public kiosks: Kiosk[] = [];
  public settings = {
    columns: columnsConfig,
    selectRow: true,
    actions: [{name: 'icon-ui-compose', callback: 'onSelectRow' }]
  };

  @Input() set searchText(text: string) {
    if (typeof text === 'string') {
      this.search = this.search.set('offset', '0').set('text', text);
      this._loadItems(this.search);
    }
  };

  @Output() public selectRow: EventEmitter<any> = new EventEmitter();

  @ViewChild('deleteConfirmModal') private deleteConfirmModal;
  @ViewChild('editModal') private editModal;

  constructor(private _api: ApiService,
    private acl: AclService,
    private _observer: KioskObserverService,
    private _modalService: NgbModal) {


    this._observer.kiosk$.subscribe((res) => {
      if (res.type === 'edit') {
        let kiosk = this.kiosks.find(app => app.id === res.data.id);
        Object.assign(kiosk, res.data);
        return;
      }

      const limit = +this.search.get('limit');
      let offset = +this.search.get('offset');
      let lastPage = Math.ceil(this.collectionSize / limit);
      let itemsOnPage = this.collectionSize % limit || limit;
      if (itemsOnPage < 10 && (String(this.currentPage) === String(lastPage))) {
        this.collectionSize += 1;
        this.kiosks.push(res.data);
      } else {
        offset += lastPage * limit;
        this.search = this.search.set('offset', String(offset));
        this._loadItems(this.search);
      }
    });

    if (acl.isAllow('canDeleteApp')) {
      this.settings.actions.push({ name: 'icon-trash', callback: 'onConfirmDelete' });
    }
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
    this.isLoading = true;
    let { id } = this.deleteData;
    let sub = this._api.location
      .deleteItem(id)
      .finally(() => {
        sub.unsubscribe();
        this.isLoading = false;
      })
      .subscribe(
      () => {
        this._observer.emit({type: 'delete', data: this.deleteData });
        const limit = +this.search.get('limit');
        const offset = +this.search.get('offset');
        this.modalRef.close();
        this.collectionSize -= 1;
        if (this.collectionSize && !(this.collectionSize % limit)) {
          this.search = this.search.set('offset', String(offset - limit));
        }
        this._loadItems(this.search);
      },
      (err) => {
        let { userMessage } = JSON.parse(err._body);
        if (userMessage) {
          console.log(userMessage);
        }
      }
      );
  }

  public onPageChange(event) {
    for (const [key, value] of Object.entries(event.search)) {
      this.search = this.search.set(key, value.toString());
    }
    this.isSearching = true;
    this._loadItems(this.search);
  }

  public onSelectRow(event) {
    this.selectRow.emit(event);
  }

  private _loadItems(params = this.search) {
    this.isSearching = true;
    this._api.kiosk.getList(params)
      .finally(() => {
        this.isSearching = false;
      })
      .take(1)
      .subscribe((res) => {
        let { total, data } = res;
        const offset = +params.get('offset');
        this.collectionSize = +total;
        this.kiosks = data;
        this.currentPage = (offset / 10) + 1;
      });
  }
}
