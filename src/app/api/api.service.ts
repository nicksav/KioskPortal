import { Injectable } from '@angular/core';
import { KioskService } from './kiosk.service';
import { LocationService } from './location.service';


@Injectable()
export class ApiService {

  constructor(
    public kiosk: KioskService,
    public location: LocationService
  ) { }

}
