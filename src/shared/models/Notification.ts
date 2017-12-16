export class Notification {
  id: string;
  from_user: string;
  from_user_id: string;
  to_user: string;
  to_user_id: string;
  created_on: string;
  modified_on: string;
  is_seen: string;
  when_seen: string;
  payload: any;
  profile_image: string;

  constructor(obj: Object) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }

}

