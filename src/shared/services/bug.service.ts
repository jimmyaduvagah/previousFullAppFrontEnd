import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, URLSearchParams } from "@angular/http";
import { HttpSettingsService } from "./HttpSettingsService";
import { Observable } from "rxjs";
import { BaseService } from "../bases/services/BaseService";

@Injectable()
export class BugService extends BaseService {
  public _basePath: string = 'dev-issues/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  public addIssue(data, params?): Observable<any> {
    // issue goes here
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    options.headers['Content-Type'] = 'text/plain';
    return this.http.post(this.getUrl(this._basePath), data, options)
      .map(res => {
        let toReturn = (res);
        return toReturn;
      })
      .catch(this.handleError);
  }

  public getClosedIssues(params?: Object): Observable<any> {
        params = this._httpSettings.addTokenToParams(params);
        let options: RequestOptionsArgs = {
            headers: this._httpSettings.getHeaders(),
            search: new URLSearchParams(this.makeStringOfParams(params))
        };
        console.log(this.getUrl());
        return this.http.get(this.getUrl(this._basePath+'closed/'), options)
            .map(res => {
                let toReturn = <any>this.listMap(res);
                this.listObject = toReturn;
                this.listO.emit(toReturn);
                return toReturn;
            })
            .catch(this.handleError);
  }

  public getAllIssues(params?: Object): Observable<any> {
        params = this._httpSettings.addTokenToParams(params);
        let options: RequestOptionsArgs = {
            headers: this._httpSettings.getHeaders(),
            search: new URLSearchParams(this.makeStringOfParams(params))
        };
        console.log(this.getUrl());
        return this.http.get(this.getUrl(this._basePath+'all/'), options)
            .map(res => {
                let toReturn = <any>this.listMap(res);
                this.listObject = toReturn;
                this.listO.emit(toReturn);
                return toReturn;
            })
            .catch(this.handleError);
  }

}
