import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/bases/services/BaseService';
import { Http, Response } from '@angular/http';
import { HttpSettingsService } from '../../shared/services/HttpSettingsService';
import { ListResponse } from '../../shared/bases/models/ListResponse';
import { Observable } from 'rxjs/Rx';
import { SessionService } from './session.service';
import { RegisterResponse } from '../models/RegisterResponse';

@Injectable()

export class RegisterService extends BaseService {

  public _basePath = 'auth-register/';

  constructor(public http: Http,
              public _httpSettings: HttpSettingsService,
              public _sesstionService: SessionService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new RegisterResponse
        (toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): RegisterResponse {
    return new RegisterResponse(res.json());
  }


  public handleError(error: Response) {
    console.error(error);
    let json = error.json();
    // var toReturn = 'Server error';
    let toReturn = json;
    if (json.hasOwnProperty('error')) {
      toReturn = json.error;
    }
    if (json.hasOwnProperty('detail')) {
      toReturn = json.detail;
    }

    return Observable.throw(toReturn);
  }
}
