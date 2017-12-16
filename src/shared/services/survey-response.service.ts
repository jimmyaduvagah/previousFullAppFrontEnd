import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BaseService } from '../bases/services/BaseService';
import { HttpSettingsService } from './HttpSettingsService';
import { ListResponse } from '../bases/models/ListResponse';
import { SurveyResponse } from '../models/Survey';

@Injectable()

export class SurveyResponseService extends BaseService {

  public _basePath = 'survey-responses/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new SurveyResponse(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): SurveyResponse {
    return new SurveyResponse(res.json());
  }

}


