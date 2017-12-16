
import { BaseModel } from '../bases/models/BaseModel';

export class LEProgress extends BaseModel {
  object: any;
  completed: boolean = false;
  completed_on: string;
  ended: boolean = false;
  ended_on: string;
  total_time_viewing: number = 0;
  course: string;
  current_course_module: string;
  current_course_module_section: string;


  constructor(obj) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }

  addTimeToViewing(value) {
    this.total_time_viewing += value;
  }

}


