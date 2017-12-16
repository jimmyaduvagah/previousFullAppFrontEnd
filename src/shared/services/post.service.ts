import { EventEmitter, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BaseService } from '../../shared/bases/services/BaseService';
import { HttpSettingsService } from '../../shared/services/HttpSettingsService';
import { ListResponse } from '../../shared/bases/models/ListResponse';
import { Post } from '../models/Post';


@Injectable()
export class PostService extends BaseService {

  public _basePath = 'posts/';
  public _baseCommentPath = '';
  public currentPost: Post;

  public attachmentObservable: EventEmitter<any> = new EventEmitter();

  public nextListUrl: string;

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings)
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      toReturn.results[num] = new Post(toReturn.results[num]);
    }
    return toReturn;
  }

  // listMapInfinite(res: Response): Array<Post> {
  //   let list = <ListResponse>res.json();
  //   if (typeof list.next !== 'undefined') {
  //     this.nextListUrl = list.next;
  //   } else {
  //     this.nextListUrl = null;
  //   }
  //   let toReturn: Post[] = [];
  //   for (let num in list.results) {
  //     toReturn.push(new Post(list.results[num]));
  //   }
  //   return toReturn;
  // }

  singleMap(res: Response): Post {
    return new Post(res.json());
  }

  setCurrentPost(post: Post) {
    this.currentPost = post;
  }

  getCurrentPost() {
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
  //
  // public getInfiniteList(params?: Object): Observable<any> {
  //   let url = this.getUrl();
  //   if (typeof this.nextListUrl !== 'undefined') {
  //     url = this.nextListUrl;
  //     if (typeof params === 'undefined') {
  //       params = {};
  //     }
  //   } else {
  //     params = this._httpSettings.addTokenToParams(params);
  //     params['limit'] = 10;
  //   }
  //   let options: RequestOptionsArgs = {
  //     headers: this._httpSettings.getHeaders(),
  //     search: new URLSearchParams(this.makeStringOfParams(params))
  //   };
  //   if (url !== null) {
  //     return this.http.get(url, options)
  //       .map(res => {
  //         let toReturn = <any>this.listMapInfinite(res);
  //         this.listObject = toReturn;
  //         this.listO.emit(toReturn);
  //         console.log(toReturn);
  //         return toReturn;
  //       })
  //       .catch(this.handleError);
  //   }
  // }

}
