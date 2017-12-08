import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LocationObserverService {

  private locationSource = new Subject<any>();
  private kiosksSource = new Subject<any>();
  private editMode = new BehaviorSubject<any>(false);
  private storageSource = new Subject<any>();

  public location$ = this.locationSource.asObservable();
  public editMode$ = this.editMode.asObservable();
  public storage$ = this.storageSource.asObservable();
  public kiosks$ = this.kiosksSource.asObservable();

  public storage: any;

  constructor() {
  }

  public emit(type, data) {
    switch (type) {
      case 'location':
        return this.locationSource.next(data);
      case 'editMode':
        return this.editMode.next(data);
      case 'kiosk':
        return this.kiosksSource.next(data);
      case 'storage':
        this.storage = data;
        return this.storageSource.next(data);
    }
  }
}
