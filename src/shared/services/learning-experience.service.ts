import { EventEmitter, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LearningExperience } from '../models/LearningExperience';
import { BaseService } from '../bases/services/BaseService';
import { HttpSettingsService } from './HttpSettingsService';
import { ListResponse } from '../bases/models/ListResponse';

@Injectable()

export class LearningExperienceService extends BaseService {

  public _basePath = 'courses/';
  public shouldRefresh: EventEmitter<boolean> = new EventEmitter();

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new LearningExperience(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): LearningExperience {
    return new LearningExperience(res.json());
  }
}
