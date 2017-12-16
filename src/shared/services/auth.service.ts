import {Http, Response, RequestOptionsArgs, URLSearchParams} from '@angular/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../bases/services/BaseService';
import { HttpSettingsService } from './HttpSettingsService';
import { SessionService } from './session.service';
import { AuthTokenService } from './authtoken.service';
import { ListResponse } from '../bases/models/ListResponse';
import { Auth } from '../models/Auth';
import { Observable } from 'rxjs/Observable';
@Injectable()

export class AuthService extends BaseService {

  public _basePath = 'api-token-auth/';

  constructor(public http: Http,
              public _httpSettings: HttpSettingsService,
              public _sesstionService: SessionService,
              private _authToken: AuthTokenService
  ) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new Auth(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): Auth {
    return new Auth(res.json());
  }

  public login(data, params?): Observable<any> {

    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getUnauthorizedHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.post(this.getUrl(), data, options)
      .map(res => {
        let toReturn = <any>this.singleMap(res);
        this.singleObject = toReturn;
        this.singleO.emit(toReturn);
        this._authToken.setToken(toReturn.token);
        this._sesstionService.actionLoggedIn();
        return toReturn;
      })
      .catch(this.handleError);
  }

  public logout(): Observable<any> {

    let params = this._httpSettings.addTokenToParams({});

    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.post(this._httpSettings.getBaseUrl() + 'logout/', '', options)
      .map(res => {
        let toReturn = <any>res.json();
        return toReturn;
      }).do(() => {
        this._authToken.clearToken();
        this._sesstionService.logout();
      })
      .catch(this.handleError);
  }

  public handleError (error: Response) {
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
