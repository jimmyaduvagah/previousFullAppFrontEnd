import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { ListResponse } from '../bases/models/ListResponse';
import { HttpSettingsService } from './HttpSettingsService';
import { BaseService } from '../bases/services/BaseService';
import { LESubmission } from '../models/LESubmission';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class LESubmissionService extends BaseService {

  public _basePath = 'le-submissions/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new LESubmission(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): LESubmission {
    return new LESubmission(res.json());
  }

  public submit(id, data, params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.post(this.getUrl() + id + '/submit/', data, options)
      .map(res => {
        let toReturn = <any>this.singleMap(res);
        this.singleObject = toReturn;
        this.singleO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

  public makeNewVersion(id, params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.post(this.getUrl() + id + '/make_new_version/', '', options)
      .map(res => {
        let toReturn = <any>this.singleMap(res);
        this.singleObject = toReturn;
        this.singleO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

}


