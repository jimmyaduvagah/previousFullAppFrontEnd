import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BaseService } from '../../shared/bases/services/BaseService';
import { HttpSettingsService } from '../../shared/services/HttpSettingsService';
import { ListResponse } from '../../shared/bases/models/ListResponse';
import { Like } from '../models/Post';


@Injectable()
export class LikeService extends BaseService {

  public _basePath = 'likes/';
  public _baseCommentPath = '';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings)
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      toReturn.results[num] = new Like(toReturn.results[num]);
    }
    return toReturn;
  }

  singleMap(res: Response): Like {
    return new Like(res.json());
  }

}
