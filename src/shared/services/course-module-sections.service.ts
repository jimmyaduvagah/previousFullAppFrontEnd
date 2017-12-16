import { Injectable } from '@angular/core';
import { BaseService } from '../bases/services/BaseService';
import { HttpSettingsService } from './HttpSettingsService';
import { Http, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { ListResponse } from '../bases/models/ListResponse';
import { CourseModuleSection } from '../models/CourseModuleSection';
import { Observable } from "rxjs";

@Injectable()

export class CourseModuleSectionsService extends BaseService {

  public _basePath = 'course-module-sections/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new CourseModuleSection(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): CourseModuleSection {
    return new CourseModuleSection(res.json());
  }

  getFullList(course_module , params?: Object): Observable<any> {
        params = this._httpSettings.addTokenToParams(params);
        let options: RequestOptionsArgs = {
            headers: this._httpSettings.getHeaders(),
            search: new URLSearchParams(this.makeStringOfParams(params))
        };
        console.log(this.getUrl());
        return this.http.get(this._httpSettings.getBaseUrl() + this._basePath + '?full=true&course_module_id='+course_module , options)
            .map(res => {
                let toReturn = <any>this.listMap(res);
                this.listObject = toReturn;
                this.listO.emit(toReturn);
                return toReturn;
            })
            .catch(this.handleError);
    }

    getSectionTypes(params?: Object): Observable<any> {
      params = this._httpSettings.addTokenToParams(params);
      let options: RequestOptionsArgs = {
        headers: this._httpSettings.getHeaders(),
        search: new URLSearchParams(this.makeStringOfParams(params))
      };
      console.log(this.getUrl());
        return this.http.get(this._httpSettings.getBaseUrl() + 'section-types/' , options)
            .map(res => {
                let toReturn = <any>this.listMap(res);
                this.listObject = toReturn;
                this.listO.emit(toReturn);
                return toReturn;
            })
            .catch(this.handleError);
    }


}


