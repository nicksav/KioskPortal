import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface KioskObservableData {
  type: 'create' | 'edit' | 'delete';
  data: any;
}

@Injectable()
export class KioskObserverService {

  private kioskSource = new Subject<any>();
  public kiosk$ = this.kioskSource.asObservable();

  constructor() {
  }

  public emit(data: KioskObservableData) {
    this.kioskSource.next(data);
  }
}
