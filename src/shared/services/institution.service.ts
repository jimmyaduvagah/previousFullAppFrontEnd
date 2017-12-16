import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response, URLSearchParams } from '@angular/http';
import { BaseService } from "../bases/services/BaseService";
import { HttpSettingsService } from "./HttpSettingsService";
import { ListResponse } from "../bases/models/ListResponse";
import { Institution } from '../models/Experience';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class InstitutionService extends BaseService {

  public _basePath = 'institutions/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new Institution(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): Institution {
    return new Institution(res.json());
  }

  public searchForBusiness(params?: Object): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    params['filter_type'] = 'Business';
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.get(this.getUrl(), options)
      .map(res => {
        let toReturn = <any>this.listMap(res);
        this.listObject = toReturn;
        this.listO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

  public searchForSchool(params?: Object): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    params['filter_type'] = 'School';
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.get(this.getUrl(), options)
      .map(res => {
        let toReturn = <any>this.listMap(res);
        this.listObject = toReturn;
        this.listO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }
}

