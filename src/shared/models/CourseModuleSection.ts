import {BaseModel} from "../bases/models/BaseModel";
import {LearningExperienceModule} from "./LearningExperienceModule";

export class CourseModuleSection extends  BaseModel {

  course_module_id: LearningExperienceModule;
  content_type:number;
  object_id: number;


  constructor (obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
          this[field] = obj[field];
      }
    }
  }
}

export class SectionText extends  BaseModel {

  title: string;
  text:string;
  html: string;


  constructor (obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
          this[field] = obj[field];
      }
    }
  }
}

export class SectionImage extends  BaseModel {

  title: string;
  text:string;
  html: string;
  image_id: string;


  constructor (obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
          this[field] = obj[field];
      }
    }
  }
}

export class SectionVideo extends  BaseModel {

  title: string;
  text:string;
  html: string;
  length: number;
  vimeo_id: string;


  constructor (obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
          this[field] = obj[field];
      }
    }
  }
}

export class SectionGallery extends  BaseModel {

  title: string;
  text:string;
  html: string;
  gallery_id: string;


  constructor (obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
          this[field] = obj[field];
      }
    }
  }
}



