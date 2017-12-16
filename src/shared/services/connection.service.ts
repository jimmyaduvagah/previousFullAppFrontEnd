import { Injectable, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { ListResponse } from '../bases/models/ListResponse';
import { HttpSettingsService } from './HttpSettingsService';
import { BaseService } from '../bases/services/BaseService';
import { Connection } from '../models/Connection';

@Injectable()

export class ConnectionService extends BaseService {

  public _basePath = 'connections/';

  public connectionsForUserListObject: EventEmitter<any> = new EventEmitter();
  public connectionsForUserListO: any;

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new Connection(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): Connection {
    return new Connection(res.json());
  }

  public connectionsForUser(userId, params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    params['user_id'] = userId;
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    console.log(options.headers);
    return this.http.get(this.getUrl() + 'for_user/', options)
      .map(res => {
        let toReturn = <any>(res);
        this.connectionsForUserListObject = toReturn;
        this.connectionsForUserListO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

  // TODO: There's an issue with the url on line 63 here...
  // public getNextConnectionsForUser():Observable<any> {
  //     if (typeof this.connectionsForUserListObject !== 'undefined') {
  //         if (this.connectionsForUserListObject.next) {
  //             let url = this.connectionsForUserListObject.next;
  //             let options:RequestOptionsArgs = {
  //                 headers: this._httpSettings.getHeaders()
  //             };
  //             return this.http.get(url, options)
  //                 .map(res => {
  //                     let toReturn = <any>this.listMap(res);
  //                     this.connectionsForUserListObject = toReturn;
  //                     this.connectionsForUserListO.emit(toReturn);
  //                     return toReturn;
  //                 })
  //                 .catch(this.handleError);
  //         }
  //     }
  // }

  public removeConnection(connectionId, params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    console.log(options.headers);
    return this.http.put(this.getUrl() + connectionId + '/' + 'remove/', '', options)
      .map(res => {
        let toReturn = <any>(res);
        this.singleObject = toReturn;
        this.singleO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }
}


