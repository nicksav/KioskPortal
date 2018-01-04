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

  public create(body) {
    return this._http
      .post(`/kiosks`, body);
  }

  public getOne(id, params = new HttpParams()) {
    return this._http.get(`/kiosks/${id}`, { params })
      .map((res) => KioskMapper.prepareData(res));
  }

  public update(id, body) {
    return this._http.put(`/kiosks/${id}`, body);
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

  public deleteItem(id) {
    return this._http.delete(`/kiosks/${id}`);
  }

  public getListByLocation(locationId, params = new HttpParams()) {
    return this._http
      .get(`/locations/${locationId}/kiosks`, { params })
      .map((res) => KioskMapper.prepareListData(res));
  }


  public pairKiosk(body: object) {
    return this._http.put(`/setup/${body['pairingCode']}/kiosk/${body['kioskId']}`, body);
  }

}
