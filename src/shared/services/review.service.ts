import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/bases/services/BaseService';
import { Http, Response } from '@angular/http';
import { HttpSettingsService } from '../../shared/services/HttpSettingsService';
import { ListResponse } from '../../shared/bases/models/ListResponse';
import { Observable } from 'rxjs/Rx';
import { SessionService } from './session.service';
import { Review } from '../models/Review';

@Injectable()

export class ReviewService extends BaseService {

  public _basePath = 'reviews/';

  constructor(public http: Http,
              public _httpSettings: HttpSettingsService,
              public _sesstionService: SessionService) {
    super(http, _httpSettings);
  }


  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new Review
        (toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): Review {
    return new Review(res.json());
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
