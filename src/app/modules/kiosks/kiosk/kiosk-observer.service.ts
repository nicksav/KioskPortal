import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class KioskObserverService {
  
  private kioskSource = new Subject<any>();
  private locationsSource = new Subject<any>();
  private editMode = new BehaviorSubject<any>(false);
  private storageSource = new Subject<any>();

  public kiosk$ = this.kioskSource.asObservable();
  public locations$ = this.locationsSource.asObservable();
  public editMode$ = this.editMode.asObservable();
  public storage$ = this.storageSource.asObservable();
  
  public storage: any;

  constructor() {
  }

  public emit(type, data) {
    switch (type) {
      case 'kiosk':
        return this.kioskSource.next(data);
      case 'editMode':
        return this.editMode.next(data);
      case 'locations':
        return this.locationsSource.next(data);
      case 'storage':
        this.storage = data;
        return this.storageSource.next(data);
    }
  }
}
