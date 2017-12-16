
import { BaseModel } from '../bases/models/BaseModel';
import { LearningExperienceImage } from './LearningExperience';

export enum LEARNING_EXPERIENCE_MODULE_TYPE {
  VIDEO = 1,
  CONTENT = 2,
  TEXT = 3,
  ASSESSMENT = 4,
  MODULE_END = 5,
  FINAL_MODULE_END = 6
}

export const LEARNING_EXPERIENCE_MODULE_TYPE_LIST: string[] = [
  'VIDEO',
  'CONTENT',
  'TEXT',
  'ASSESSMENT',
  'MODULE_END',
  'FINAL_MODULE_END'
];

export class LearningExperienceModule extends BaseModel {
  title: string = '';
  order: number = 0;
  image: LearningExperienceImage;
  image_id: string;
  description: string = '';
  state: string;
  deleted: string;
  course: string;
  sections: any[] = [];

  constructor(obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        if (obj[field] == "image") {
          this[field] = new LearningExperienceImage(obj[field]);
        } else {
          this[field] = obj[field];
        }

      }
    }
  }
}

