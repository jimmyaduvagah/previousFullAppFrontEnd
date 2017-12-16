import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { ListResponse } from '../bases/models/ListResponse';
import { HttpSettingsService } from './HttpSettingsService';
import { BaseService } from '../bases/services/BaseService';
import { LESubmission } from '../models/LESubmission';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class LESubmissionRatingService extends BaseService {

  public _basePath = 'le-submission-ratings/';

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

  public getMetrics(params?: Object): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.get(this.getUrl() + '/metrics/', options)
      .map(res => {
        return <any>res.json();
      })
      .catch(this.handleError);
  }

}


