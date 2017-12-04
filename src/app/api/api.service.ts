import { Injectable } from '@angular/core';
import { KioskService } from './kiosk.service';


@Injectable()
export class ApiService {

  constructor(
    public kiosk: KioskService,
  ) { }

}
