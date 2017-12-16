export class RegisterResponse {
  public will_account_be_activated: boolean = false;

  constructor(obj) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}
