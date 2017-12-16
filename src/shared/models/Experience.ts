import { BaseModel } from "../bases/models/BaseModel";

export class Experience extends BaseModel {
  date_from: string = '';
  date_to: string = '';
  summary: string = '';
  job_title: string = '';
  institution: Institution;
  institution_id: string;
  user_id: string;
  type: string = '';
  type_id: string;
  degree: string;
  constructor (obj) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}
export class Institution extends BaseModel {
  title: string;
  type: string;
  constructor (obj) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}
export const EXPERIENCE_TYPES = {
  Job: 'eac3313e-f22e-4301-9169-477aa4b8b313',
  Internship: '8e12ea4c-c222-42db-acf1-e81fd7d768bd',
  Education: '2df68ab6-5b76-4996-9a77-a62e07bc552d'
};
