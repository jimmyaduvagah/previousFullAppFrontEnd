import { EventEmitter, Injectable } from '@angular/core';
import {Http, Headers, Response, RequestOptionsArgs, URLSearchParams} from '@angular/http';
import { Observable } from "rxjs/Observable";
import { ObservableArray } from 'data/observable-array';
import { Link } from './link';
import { Post } from '../models/Post';
import { BaseService } from '../bases/services/BaseService';
import { HttpSettingsService } from './HttpSettingsService';
import { ListResponse } from '../bases/models/ListResponse';


@Injectable()
export class FeedService extends BaseService {

    public _basePath = 'posts/';
    public _baseCommentPath = '';
    public currentPost: Post;

    public attachmentObservable: EventEmitter<any> = new EventEmitter();

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

    setCurrentPost(post:Post){
        this.currentPost = post;
        console.log(post);
    }

    getCurrentPost(){
        return this.currentPost;
    }

    // updatePostInList(post:Post) {
    //     let index = 0;
    //     for (let p of this.listObservable) {
    //         if (p.id === post.id) {
    //             this.listObservable.setItem(index, post);
    //             console.log('updating index ' + index);
    //             break
    //         } else {
    //             index ++;
    //         }
    //     }
    // }
}