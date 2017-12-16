import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BaseService } from '../bases/services/BaseService';
import { HttpSettingsService } from './HttpSettingsService';
import { ListResponse } from '../bases/models/ListResponse';
import { Notification } from '../models/Notification';


@Injectable()
export class NotificationService extends BaseService {

  public _basePath = 'notifications/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings)
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      toReturn.results[num] = new Notification(toReturn.results[num]);
    }
    return toReturn;
  }

  singleMap(res: Response): Notification {
    return new Notification(res.json());
  }

  markAsSeen(id) {
    return this.patch(id, {
      is_seen: true
    });
  }

}
