import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptionsArgs, URLSearchParams} from '@angular/http';
import { Observable } from "rxjs/Observable";
import { BaseService } from '../bases/services/BaseService';
import { Post } from '../models/Post';
import { HttpSettingsService } from './HttpSettingsService';
import { ListResponse } from '../bases/models/ListResponse';


@Injectable()
export class CommentService extends BaseService {

    public _basePath = 'posts/';
    public _commentsPath = 'comments/';
    public currentPost: Post;

    constructor(public http: Http, public _httpSettings:HttpSettingsService) {
        super(http, _httpSettings)
    }

    listMap(res:Response):ListResponse {
        let toReturn = <ListResponse>res.json();
        for (let num in toReturn.results) {
            toReturn.results[num] = new Post(toReturn.results[num]);
        }
        return toReturn;
    }

    singleMap(res:Response):Post {
        return new Post(res.json());
    }

    public getListForPost(postId: string, params?: Object): Observable<any> {
        params = this._httpSettings.addTokenToParams(params);
        let options: RequestOptionsArgs = {
            headers: this._httpSettings.getHeaders(),
            search: new URLSearchParams(this.makeStringOfParams(params))
        };
        return this.http.get(this.getUrl(this._basePath + postId + '/' + this._commentsPath), options)
            .map(res => {
                let toReturn = <any>this.listMap(res);
                this.listObject = toReturn;
                this.listO.emit(toReturn);
                return toReturn;
            })
            .catch(this.handleError);
    }


}
