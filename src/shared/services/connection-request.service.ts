import { Injectable, EventEmitter } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response, RequestOptionsArgs, URLSearchParams, Headers} from '@angular/http';
import { Connection } from '../models/Connection';
import { ListResponse } from '../bases/models/ListResponse';
import { HttpSettingsService } from './HttpSettingsService';
import { BaseService } from '../bases/services/BaseService';

@Injectable()

export class ConnectionRequestService extends BaseService {

  public _basePath = 'connection-requests/';

  public mySentRequestsSingleO: EventEmitter<any> = new EventEmitter();
  public mySentRequestsListO: EventEmitter<any> = new EventEmitter();
  public mySentRequestsSingleObject: any;
  public mySentRequestsListObject: any;

  public myReceivedRequestsSingleO: EventEmitter<any> = new EventEmitter();
  public myReceivedRequestsListO: EventEmitter<any> = new EventEmitter();
  public myReceivedRequestsSingleObject: any;
  public myReceivedRequestsListObject: any;

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

  public myReceivedRequests(params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.get(this.getUrl() + 'my_received_requests/', options)
      .map(res => {
        let toReturn = <any>this.listMap(res);
        this.myReceivedRequestsListObject = toReturn;
        this.myReceivedRequestsListO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

  public getNextMyReceivedRequests():Observable<any> {
    if (typeof this.myReceivedRequestsListObject !== 'undefined') {
      if (this.myReceivedRequestsListObject.next) {
        let url = this.myReceivedRequestsListObject.next;
        let options:RequestOptionsArgs = {
          headers: this._httpSettings.getHeaders()
        };
        return this.http.get(url, options)
          .map(res => {
            let toReturn = <any>this.listMap(res);
            this.myReceivedRequestsListObject = toReturn;
            this.myReceivedRequestsListO.emit(toReturn);
            return toReturn;
          })
          .catch(this.handleError);
      }
    }
  }


  public mySentRequests(params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.get(this.getUrl() + 'my_sent_requests/', options)
      .map(res => {
        let toReturn = <any>this.listMap(res);
        this.mySentRequestsListObject = toReturn;
        this.mySentRequestsListO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }


  public getNextmySentRequests():Observable<any> {
    if (typeof this.mySentRequestsListObject !== 'undefined') {
      if (this.mySentRequestsListObject.next) {
        let url = this.mySentRequestsListObject.next;
        let options:RequestOptionsArgs = {
          headers: this._httpSettings.getHeaders()
        };
        return this.http.get(url, options)
          .map(res => {
            let toReturn = <any>this.listMap(res);
            this.mySentRequestsListObject = toReturn;
            this.mySentRequestsListO.emit(toReturn);
            return toReturn;
          })
          .catch(this.handleError);
      }
    }
  }


  public acceptRequest(connectionRequestId, params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.put(this.getUrl() + connectionRequestId + '/accept/', '', options)
      .map(res => {
        let toReturn = <any>(res);
        this.singleObject = toReturn;
        this.singleO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

  public rejectRequest(connectionRequestId, params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.put(this.getUrl() + connectionRequestId + '/reject/', '', options)
      .map(res => {
        let toReturn = <any>(res);
        this.singleObject = toReturn;
        this.singleO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

  public withdrawRequest(connectionRequestId, params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.put(this.getUrl() + connectionRequestId + '/withdraw/', '', options)
      .map(res => {
        let toReturn = <any>(res);
        this.singleObject = toReturn;
        this.singleO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

}


