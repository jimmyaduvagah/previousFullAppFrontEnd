import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { BaseService } from "../bases/services/BaseService";
import { HttpSettingsService } from "./HttpSettingsService";
import { ListResponse } from "../bases/models/ListResponse";
import { Experience } from "../models/Experience";

@Injectable()

export class ExperienceService extends BaseService {

  public _basePath = 'user-profile-experiences/';
  public listOEducation: EventEmitter<any> = new EventEmitter();
  public listOJobs: EventEmitter<any> = new EventEmitter();

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new Experience(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): Experience {
    return new Experience(res.json());
  }

  public getJobs(params?: Object): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.get(this.getUrl() + 'jobs/', options)
      .map(res => {
        let toReturn = <any>this.listMap(res);
        this.listObject = toReturn;
        this.listO.emit(toReturn);
        this.listOJobs.emit(toReturn.results);
        return toReturn;
      })
      .catch(this.handleError);
  }

  public getEducation(params?: Object): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.get(this.getUrl() + 'education/', options)
      .map(res => {
        let toReturn = <any>this.listMap(res);
        this.listObject = toReturn;
        this.listO.emit(toReturn);
        this.listOEducation.emit(toReturn.results);
        return toReturn;
      })
      .catch(this.handleError);
  }
}

