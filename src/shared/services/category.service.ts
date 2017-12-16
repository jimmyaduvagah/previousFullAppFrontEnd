import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LearningExperienceCategory} from '../models/LearningExperience';
import { BaseService } from '../bases/services/BaseService';
import { HttpSettingsService } from './HttpSettingsService';
import { ListResponse } from '../bases/models/ListResponse';

@Injectable()

export class CategoryService extends BaseService {

  public _basePath = 'course-categories/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new LearningExperienceCategory(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): LearningExperienceCategory {
    return new LearningExperienceCategory(res.json());
  }

}


