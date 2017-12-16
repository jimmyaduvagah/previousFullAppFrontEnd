export class Link {
  _url: string = '';
  url: string;
  title: string;
  description: string;
  images: string[];
  image: string;
  display: string = 'horizontal';
  content_type: string;
  type: string;

  constructor(obj) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }

}
