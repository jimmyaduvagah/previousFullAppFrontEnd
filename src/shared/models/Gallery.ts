
import {LearningExperienceImage} from "./LearningExperience";
import {BaseModel} from "../bases/models/BaseModel";

export class Gallery extends  BaseModel {

  title: string;
  images: GalleryImage [];

  constructor (obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
          this[field] = obj[field];
      }
    }
  }

}

export class GalleryImage extends  BaseModel {

  order: number;
  image_id : LearningExperienceImage;
  gallery_id: any;

  constructor(obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}

