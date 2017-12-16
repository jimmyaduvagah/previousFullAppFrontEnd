import { BaseModel } from '../bases/models/BaseModel';


export class QuizAnswer extends BaseModel {

  order: number;
  answer: string;
  id: string;

  constructor(obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}

export class QuizQuestion extends BaseModel {

  id: string;
  answers: QuizAnswer[];
  order: number;
  question: string;
  correct_answer: string;
  chosen_answer: string; // non server property

  constructor(obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}

export class Quiz extends BaseModel {

  quiz_questions: QuizQuestion[];
  title: string;
  instructions: string;
  instructions_html: string;

  constructor(obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}


export class QuizSection extends BaseModel {

  id: string;
  quiz: Quiz;
  title: string;
  type: string;
  section_id: string;

  constructor(obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}
