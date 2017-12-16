import { Injectable } from '@angular/core';
import { BaseService } from '../bases/services/BaseService';
import { HttpSettingsService } from './HttpSettingsService';
import {Http, RequestOptionsArgs, Response} from '@angular/http';
import { ListResponse } from '../bases/models/ListResponse';
import { LearningExperienceModule } from '../models/LearningExperienceModule';
import {Observable} from "rxjs/Observable";

@Injectable()

export class LearningExpereienceModuleService extends BaseService {

  public _basePath = 'course-modules/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new LearningExperienceModule(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): LearningExperienceModule {
    return new LearningExperienceModule(res.json());
  }




}


