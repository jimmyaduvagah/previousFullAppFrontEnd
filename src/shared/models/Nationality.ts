
export class Nationality {

  id: string;
  name: string;
  slug: string;

  constructor (obj: Object) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }

}
