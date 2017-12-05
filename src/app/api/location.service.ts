import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationMapper } from './mappers/location.mapper';
import 'rxjs/add/operator/map'

@Injectable()
export class LocationService {

    constructor(private _http: HttpClient) { }
    
   
    public getList(params = new HttpParams()) {
    return this._http
        .get(`/locations`, { params })
        .map((res) => LocationMapper.prepareDataList(res));
    }

    public create(body) {
    return this._http
        .post(`/locations`, body);
    }

    public getOne(id, params = new HttpParams()) {
        return this._http.get(`/locations/${id}`, { params })
          .map((res) => LocationMapper.prepareData(res));
    }

    public deleteItem(id) {
        return this._http.delete(`/locations/${id}`);
    }
}
