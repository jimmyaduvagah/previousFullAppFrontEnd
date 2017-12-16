import { BaseModel } from '../bases/models/BaseModel';

export class Survey extends BaseModel {
  public id: string;
  public title: string;
  public groups: SurveyGroup[];

  constructor (obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}

export class SurveyGroup {
  public uuid: string;
  public title: string;
  public description: string;
  public questions: any[] = [];

  constructor (obj: Object) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}


export class SurveyQuestion {
  public uuid: string;
  public question: string;
  public type: string;
  public answers: SurveyQuestionAnswer[];
  public scale?: number[];

  constructor (obj: Object) {
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }
}

interface SurveyQuestionAnswer {
  title: string;
}


export class SurveyQuestionResponse extends SurveyQuestion {

  public response: any = null;

  constructor (obj: Object) {
    super(obj);
  }

  setResponse(data) {
    this.response = data;
  }

  removeItemFromResponseArray(item) {
    for (let i in this.response) {
      if (this.response[i].title === item.title) {
        console.log(this.response.splice(i, 1));
        break;
      }
    }
  }

}


export class SurveyResponse extends BaseModel {

  public title: string;
  public survey: string;
  public user: string;
  public answer_data: any;

  constructor (obj: Object) {
    super();
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        this[field] = obj[field];
      }
    }
  }

  setAnswerData(data) {
    this.answer_data = data;
  }

}