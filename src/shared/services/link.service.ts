import { Link } from "../models/Link";
import { Injectable } from "@angular/core";
import { BaseService } from "../bases/services/BaseService";
import { HttpSettingsService } from "./HttpSettingsService";
import { Http, RequestOptionsArgs, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class LinkService extends BaseService {

  public _basePath = 'post-creation/';
  public _baseCommentPath = '';

  constructor(public http: Http, public _httpSettings:HttpSettingsService) {
    super(http, _httpSettings)
  }

  map(res:Response):Link[] {
    let toReturn = <Link[]>res.json();
    for (let num in toReturn) {
      toReturn[num] = new Link(toReturn[num]);
    }
    return toReturn;
  }

  public post(data, params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.post(this.getUrl(), data, options)
      .map(res => {
        let toReturn = <any>this.map(res);
        if (toReturn.length > 0) {
          toReturn = toReturn[0]
        } else {
          toReturn = null
        }
        return toReturn;
      })
      .catch(this.handleError);
  }

}
