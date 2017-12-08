import { HttpClient, HttpParams } from '@angular/common/http';
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

  public getList(params = new HttpParams()) {
    return this._http
      .get(`/Kiosks`, { params })
      .map((res) => KioskMapper.prepareListData(res));
  }

  public getListByLocation(locationId, params = new HttpParams()) {
    return this._http
      .get(`/locations/${locationId}/kiosks`, { params })
      .map((res) => KioskMapper.prepareListData(res));
  }


}
