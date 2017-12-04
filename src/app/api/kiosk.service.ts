import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KioskMapper } from './mappers/kiosk.mapper';

@Injectable()
export class KioskService {

  constructor(private _http: HttpClient) { }

  public token(pairCode) {
    return this._http.get(`/Kiosks/token/Password!/${pairCode}`)
    .map((res) => KioskMapper.prepareData(res));
  }

  public getCallToken(){
    return this._http.get('/Kiosks/twillio/token')
    .map((res) => KioskMapper.prepareData(res));
  }


}
