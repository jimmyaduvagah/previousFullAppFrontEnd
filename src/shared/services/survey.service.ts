import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BaseService } from '../bases/services/BaseService';
import { HttpSettingsService } from './HttpSettingsService';
import { ListResponse } from '../bases/models/ListResponse';
import { Survey } from '../models/Survey';

@Injectable()

export class SurveyService extends BaseService {

  public _basePath = 'surveys/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new Survey(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): Survey {
    return new Survey(res.json());
  }

}


