import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BaseService } from "../bases/services/BaseService";
import { HttpSettingsService } from "./HttpSettingsService";
import { ListResponse } from "../bases/models/ListResponse";
import { Nationality } from '../models/Nationality';

@Injectable()

export class NationalityService extends BaseService {

  public _basePath = 'nationalities/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new Nationality(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): Nationality {
    return new Nationality(res.json());
  }


}

