import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { PostReport } from '../models/Post';
import { BaseService } from '../bases/services/BaseService';
import { HttpSettingsService } from './HttpSettingsService';
import { ListResponse } from '../bases/models/ListResponse';


@Injectable()
export class PostReportService extends BaseService {

  public _basePath = 'post-reports/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings)
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      toReturn.results[num] = new PostReport(toReturn.results[num]);
    }
    return toReturn;
  }

  singleMap(res: Response): PostReport {
    return new PostReport(res.json());
  }

}
