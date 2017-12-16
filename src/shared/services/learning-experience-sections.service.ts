import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BaseService } from '../bases/services/BaseService';
import { HttpSettingsService } from './HttpSettingsService';
import { ListResponse } from '../bases/models/ListResponse';
import { SectionText, SectionImage, SectionVideo, SectionGallery, Gallery, GalleryImage } from '../models/LearningExperienceSections';


@Injectable()
export class SectionTextService extends BaseService {

  public _basePath = 'section-texts/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new SectionText(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): SectionText {
    return new SectionText(res.json());
  }

}

@Injectable()
export class SectionImageService extends BaseService {

  public _basePath = 'section-images/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new SectionImage(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): SectionImage {
    return new SectionImage(res.json());
  }

}

@Injectable()
export class SectionVideoService extends BaseService {

  public _basePath = 'section-video-containers/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new SectionVideo(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): SectionVideo {
    return new SectionVideo(res.json());
  }
}


@Injectable()
export class SectionGalleryService extends BaseService {

  public _basePath = 'section-galleries/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new SectionGallery(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): SectionGallery {
    return new SectionGallery(res.json());
  }

}

@Injectable()
export class GalleryService extends BaseService {

  public _basePath = 'galleries/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new Gallery(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): Gallery {
    return new Gallery(res.json());
  }
}

@Injectable()
export class GalleryImageService extends BaseService {

  public _basePath = 'gallery-images/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new GalleryImage(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): GalleryImage {
    return new GalleryImage(res.json());
  }
}

@Injectable()
export class SectionQuizService extends BaseService {

  public _basePath = 'section-quizzes/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new GalleryImage(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): GalleryImage {
    return new GalleryImage(res.json());
  }
}

@Injectable()
export class QuizSectionService extends BaseService {

  public _basePath = 'quizzes/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new GalleryImage(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): GalleryImage {
    return new GalleryImage(res.json());
  }
}

@Injectable()
export class QuestionSectionService extends BaseService {

  public _basePath = 'quiz-questions/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new GalleryImage(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): GalleryImage {
    return new GalleryImage(res.json());
  }
}


@Injectable()
export class AnswerSectionService extends BaseService {

  public _basePath = 'quiz-question-answers/';

  constructor(public http: Http, public _httpSettings: HttpSettingsService) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = new GalleryImage(toReturn.results[num]);
      }
    }
    return toReturn;
  }

  singleMap(res: Response): GalleryImage {
    return new GalleryImage(res.json());
  }
}