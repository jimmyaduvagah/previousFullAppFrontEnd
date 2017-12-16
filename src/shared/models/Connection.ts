
import { UserMinimal } from './User';
import { BaseModel } from '../bases/models/BaseModel';

export class Connection extends BaseModel {

  from_user_id: string;
  from_user?: string;
  from_user_obj?: UserMinimal;
  to_user_id: string;
  to_user: string;
  to_user_obj: UserMinimal;
  state: string;
  state_id: string;

  constructor (obj) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}