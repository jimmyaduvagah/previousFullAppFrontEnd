import { BaseService } from '../bases/services/BaseService';
import { Http, Response, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { HttpSettingsService } from './HttpSettingsService';
import { ListResponse } from '../bases/models/ListResponse';
import { LearningExperience } from '../models/LearningExperience';
import { Observable } from 'rxjs';

export class LearningExperienceImageService extends BaseService {

  public _basePath = 'images/';

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new LearningExperience(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): LearningExperience {
    return new LearningExperience(res.json());
  }

  upload64Image(data, params?): Observable<any> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.post(this._httpSettings.getBaseUrl() + this._basePath + 'upload_base64/', data, options)
      .map(res => {
        let toReturn = <any>this.singleMap(res);
        this.singleObject = toReturn;
        this.singleO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

  uploadbinImage(data, file, params?): Observable<any> {
    // TODO: fix the uploading of binary: stil not working 100%
    params = this._httpSettings.addTokenToParams(params);
    let headers = this._httpSettings.getMultipartFormDataHeaders();
    headers.set('Content-Disposition', 'attachment; filename="' + file.name.replace('"', '-') + '"');
    headers.set('Content-Length', file.size);
    headers.set('Content-Type', file.type);

    let options: RequestOptionsArgs = {
      headers: headers,
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.post(this._httpSettings.getBaseUrl() + this._basePath + 'upload/', data, options)
      .map(res => {
        let toReturn = <any>this.singleMap(res);
        this.singleObject = toReturn;
        this.singleO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

}