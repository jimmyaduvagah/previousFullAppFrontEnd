
export class AuthUser {

  username: string;
  password: string;

  constructor (obj: Object) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
          this[field] = obj[field];
      }
    }
  }

}
