import { addZ } from '../utils/numbers';

export class UserProfile {
  id: number;
  is_approver: boolean = false;
  user_id: number;
  company_id: number;
  user_image: string;
  is_admin: boolean = false;
  is_staff: boolean = false;
  pto_per_year: number;
  sick_days_per_year: number;
  address_country: number;

  constructor (obj: Object) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}

export class User {

  id: string;
  pk: string;
  url: string;
  username: string;
  first_name: string = '';
  last_name: string = '';
  bio: string = '';
  bio_html: string = '';
  completed_initial_setup: boolean = false;
  is_staff: boolean = false;
  is_superuser: boolean = false;
  email: string = '';
  phone_number: string = '';
  phone_country_code: string = '';
  phone_country_dial_code: string = '';
  profile_image: string;
  profile_image_base64: string; // only used for uploading new image.
  date_of_birthObj: Date;
  date_of_birth: string;
  gender: string = '';
  groups: number[] = [];
  nationality: string = '';
  town_of_residence: string = '';
  place_of_birth: string = '';
  nationality_id: string = '';
  town_of_residence_id: string = '';
  place_of_birth_id: string = '';
  userprofile: UserProfile = new UserProfile({});
  is_admin: boolean = false;
  // these are only here if we do people search requests
  pending_request?: string;
  connected?: boolean;

  constructor (obj: Object) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        if (field === 'pk') {
          this[field] = obj[field];
          this.id = obj[field];
        } else {
          this[field] = obj[field];
        }
      }
    }
  }

  getName() {
    if (
      typeof this.first_name === 'undefined' ||
      typeof this.last_name === 'undefined' ||
      typeof this.first_name === null ||
      typeof this.last_name === null
    ) {
      console.error('Please set the user\'s name for user id: ' + this.id);
      return this.username;
    } else {
      return this.first_name + ' ' + this.last_name;
    }
  }

  prepareForSave() {
    let d = new Date(this.date_of_birth);
    this.date_of_birth = d.getFullYear() + '-' + addZ(d.getMonth() + 1) + '-' + addZ(d.getDate());
    console.log('prepared for save');
  }
}

export class UserMinimal {

  id: string;
  full_name: string = '';
  first_name: string = '';
  last_name: string = '';
  profile_image: string;
  town_of_residence: string;
  is_friend?: boolean;

  // these are only here if we do people search requests
  pending_request?: string;
  connected?: boolean;

  constructor (obj: Object) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        if (field === 'pk') {
          this[field] = obj[field];
          this.id = obj[field];
        } else {
          this[field] = obj[field];
        }
      }
    }
  }

  getName() {
    if (
      typeof this.first_name === 'undefined' ||
      typeof this.last_name === 'undefined' ||
      typeof this.first_name === null ||
      typeof this.last_name === null
    ) {
      console.error('Please set the user\'s name for user id: ' + this.id);
      return this.id;
    } else {
      return this.first_name + ' ' + this.last_name;
    }
  }

}

export class UserRegister {

  email: string = '';
  password: string = '';
  password_again: string = '';
  first_name: string = '';
  last_name: string = '';
  invitation_code: string = '';

  constructor (obj: Object) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }


}
