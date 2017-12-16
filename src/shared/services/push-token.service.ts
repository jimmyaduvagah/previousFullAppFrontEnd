import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ListResponse } from '../bases/models/ListResponse';
import { HttpSettingsService } from './HttpSettingsService';
import { BaseService } from '../bases/services/BaseService';
import { TWPushToken } from '../models/TWPushToken';

@Injectable()

export class PushTokenService extends BaseService {

  public _basePath = 'push-tokens/';


  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new TWPushToken(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): TWPushToken {
    return new TWPushToken(res.json());
  }

}


