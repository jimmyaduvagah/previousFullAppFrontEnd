import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response, URLSearchParams } from '@angular/http';
import { ListResponse } from '../bases/models/ListResponse';
import { HttpSettingsService } from './HttpSettingsService';
import { BaseService } from '../bases/services/BaseService';
import { LEProgress } from '../models/LEProgress';
import { Observable } from 'rxjs/Observable';
import * as deepmerge from 'deepmerge';

@Injectable()

export class LEProgressService extends BaseService {

  public _basePath = 'course-progress/';

  private patchTimeout;
  private lastPatchObservable;
  private patchCache = {};

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new LEProgress(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): LEProgress {
    return new LEProgress(res.json());
  }

  public patch(id, data, params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    if (this.patchTimeout) {
      clearTimeout(this.patchTimeout);
      this.patchTimeout = undefined;
    }
    this.patchCache = deepmerge(this.patchCache, data);

    let observable = this.lastPatchObservable = this.http.patch(this.getUrl() + id + '/', this.patchCache, options)
                     .map(res => {
                       let toReturn = <any>this.singleMap(res);
                       this.singleObject = toReturn;
                       this.singleO.emit(toReturn);
                       return toReturn;
                     })
                     .catch(this.handleError);
    this.patchTimeout = setTimeout(() => {
      observable.subscribe(()=>{
        this.patchCache = {};
      });
    }, 2000);
    return Observable.create((subscriber) => {

      subscriber.next(this.singleObject);
      subscriber.complete(this.singleObject);

      return () => {
        //
      };
    });
  }
  pickUpQueue() {

  }

  updateSection(section_id) {
    return Observable.create((subscriber) => {

      if (this.singleObject) {
        this.patch(this.singleObject.id, {
          current_course_module_section: section_id
        }).subscribe((res) => {
          subscriber.next(res);
          subscriber.complete(res);
        });
      } else {
        subscriber.error('You need to have already retrieved a progress object.');
      }

      return () => {
        //cleanup
      };
    });
  }

  update(obj) {
    return Observable.create((subscriber) => {

      if (this.singleObject) {
        this.patch(this.singleObject.id, obj).subscribe((res) => {
          subscriber.next(res);
          subscriber.complete(res);
        });
      } else {
        subscriber.error('You need to have already retrieved a progress object.');
      }

      return () => {
        //cleanup
      };
    });
  }

  getOrSet(section_id, field, value) {
    if (this.sectionHasInObject(section_id, field)) {
      return this.getFieldInSectionObject(section_id, field);
    } else {
      this.updateObjectField(this.singleObject.id, field, value).subscribe((res) => {
        //
      });
      return value;
    }
  }

  updateObjectField(section_id, field, value) {
    return Observable.create((subscriber) => {
      if (this.singleObject) {

        if (!this.sectionIsInObject(section_id)) {
          this.singleObject.object[section_id] = {};
        }
        this.singleObject.object[section_id][field] = value;

        this.patch(this.singleObject.id, {
          object: this.singleObject.object
        }).subscribe((res) => {
          subscriber.next(res);
          subscriber.complete(res);
        });
      } else {
        subscriber.error('You need to have already retrieved a progress object.');
      }

      return () => {
        //cleanup
      };
    });
  }

  updateObject(section_id, obj) {
    return Observable.create((subscriber) => {
      if (this.singleObject) {

        if (!this.sectionIsInObject(section_id)) {
          this.singleObject.object[section_id] = {};
        }
        this.singleObject.object[section_id] = obj;

        this.patch(this.singleObject.id, {
          object: this.singleObject.object
        }).subscribe((res) => {
          subscriber.next(res);
          subscriber.complete(res);
        });
      } else {
        subscriber.error('You need to have already retrieved a progress object.');
      }

      return () => {
        //cleanup
      };
    });
  }

  sectionIsInObject(section_id) {
    return this.singleObject.object.hasOwnProperty(section_id);
  }

  sectionHasInObject(section_id, field) {
    if (this.sectionIsInObject(section_id)) {
      return (this.singleObject.object[section_id].hasOwnProperty(field));
    } else {
      return false;
    }
  }
  getFieldInSectionObject(section_id, field) {
    if (this.sectionHasInObject(section_id, field)) {
      return this.singleObject.object[section_id][field];
    } else {
      return null;
    }
  }


}


