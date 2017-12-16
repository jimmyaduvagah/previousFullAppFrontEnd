import {BaseModel} from "../bases/models/BaseModel";

export class SectionText extends  BaseModel {

  title: string;
  text: string;
  html: string;
  textColor?: string;
  backgroundColor?: string;


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
  images: any;

  constructor (obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
          this[field] = obj[field];
      }
    }
  }
}

export class Gallery extends  BaseModel {

  title: string;
  images:string[];


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
  image_id:string;
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
