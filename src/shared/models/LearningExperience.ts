import { BaseModel } from '../bases/models/BaseModel';

export class LearningExperienceImage {
  id: string;
  src: string;
  width: number;
  height: number;

  constructor(obj: Object) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }

}

export interface LearningExperienceAuthors {
  id: string;
  name: string;
}

export class LearningExperience extends BaseModel {
  title: string = '';
  description: string = '';
  state: string = '';
  color: string = '';
  category: string = '';
  category_id: string = '';
  order: number = 0;
  deleted: boolean = false;
  authors_json: LearningExperienceAuthors[] = [];
  authors: string[];
  image: LearningExperienceImage;
  image_id: string;
  rating: string;
  vimeo?: any;
  vimeo_id?: string;
  tags_json: any[];
  // read only fields
  is_completed: boolean = false;
  is_started: boolean = false;

  constructor(obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}


export class LearningExperienceCategory extends BaseModel {
  id: string ='';
  title: string = '';
  description: string = '';
  color: string = '';
  is_active: boolean = false;
  deleted: boolean = false;


  constructor(obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}
