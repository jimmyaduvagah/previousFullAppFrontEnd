
import { BaseModel } from '../bases/models/BaseModel';
import { LearningExperienceImage } from './LearningExperience';

export class LESubmission extends BaseModel {
  title: string;
  description: string;
  markdown: string;
  html: string;
  version: number = 1;
  versions: LESubmission[] = [];
  ratings: LESubmissionRating[] = [];
  number_of_ratings: number = 0;
  average_rating: number;
  average_ratings: any = {};
  approved: boolean = false;
  approved_on: string;
  submitted: boolean = false;
  submitted_on: string;
  deleted: boolean = false;
  deleted_on: string;
  image: LearningExperienceImage;
  image_id: string;
  have_i_rated: boolean = false;

  constructor(obj) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }

  getStatus() {
    if (this.submitted === false) {
      return 'In Progress';
    }
    if (this.submitted === true) {
      if (this.number_of_ratings === 0) {
        return 'Submitted';
      }
      if (this.number_of_ratings >= 3) {
        return 'Reviewed';
      }
      if (this.number_of_ratings > 0) {
        return 'In Review';
      }
      if (this.approved === true) {
        return 'Approved';
      }
    }
  }

  getStatusCodeName() {
    if (this.submitted === false) {
      return 'in_progress';
    }
    if (this.submitted === true ) {
      if (this.number_of_ratings === 0) {
        return 'submitted';
      }
      if (this.number_of_ratings >= 3) {
        return 'reviewed';
      }
      if (this.number_of_ratings > 0) {
        return 'in_review';
      }
      if (this.approved === true) {
        return 'approved';
      }
    }
  }

  getRanking(index) {
    if (this.ratings.hasOwnProperty(index)) {
      return this.ratings[index].average_rating;
    }
    return '';
  }

}


export class LESubmissionRating extends BaseModel {
  average_rating: number;
  ratings: any = {};
  approved: boolean = false;
  le_submission: string;
  comments: string;

  constructor(obj) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }

}


