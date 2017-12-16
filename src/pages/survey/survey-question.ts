import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { SurveyQuestion, SurveyQuestionResponse } from '../../shared/models/Survey';


@Component({
  selector: 'survey-question',
  templateUrl: 'survey-question.html'
})
export class SurveyQuestionComponent implements OnDestroy, AfterViewInit {

  @Input()
  public question: SurveyQuestion;

  @Output()
  public surveyQuestionResponseOutput: EventEmitter<any> = new EventEmitter();

  public surveyQuestionResponse: SurveyQuestionResponse;

  public chosenAnswer: string;

  public typedAnswer = '';

  public scaleOptions: number[] = [];

  constructor(
    private _toastCtrl: ToastController,
  ) {
  }

  ionViewDidEnter() {
  }

  ngAfterViewInit() {
    this.surveyQuestionResponse = new SurveyQuestionResponse(this.question);
    switch (this.question.type) {
      case 'scale':
        let i = this.question.scale[0];
        while (i <= this.question.scale[1]) {
          this.scaleOptions.push(i);
          i++;
        }
        break;
      case 'checkbox':
      case 'checkbox-with-other':
        this.surveyQuestionResponse.response = [];
        break;
    }
  }

  showToast(msg, time=3000) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: time,
      position: 'top'
    });
    toast.present();
  }

  ngOnDestroy() {
  }

  checkBoxAnswerTapped($event, answer) {
    if (answer.selected) {
      this.surveyQuestionResponse.removeItemFromResponseArray(answer);
      this.surveyQuestionResponseOutput.emit(this.surveyQuestionResponse);
      answer.selected = false;
    } else {
      this.surveyQuestionResponse.response.push(answer);
      this.surveyQuestionResponseOutput.emit(this.surveyQuestionResponse);
      answer.selected = true;
    }
  }

  checkboxOtherAnswerTyped($event, answer) {
    answer.typedAnswer = $event;
    console.log('checkboxOtherAnswerTyped');
    if ($event.length > 0) {
      if (!answer.selected) {
        answer.selected = true;
        this.surveyQuestionResponse.response.push(answer);
        this.surveyQuestionResponseOutput.emit(this.surveyQuestionResponse);
      }
    } else {
      answer.selected = false;
      this.surveyQuestionResponse.removeItemFromResponseArray(answer);
      this.surveyQuestionResponseOutput.emit(this.surveyQuestionResponse);
    }

  }


  answerTapped($event, answer) {
    this.surveyQuestionResponse.setResponse(answer);
    this.surveyQuestionResponseOutput.emit(this.surveyQuestionResponse);
  }

  otherAnswerTyped($event) {
    this.chosenAnswer = $event;
    this.surveyQuestionResponse.setResponse($event);
    this.surveyQuestionResponseOutput.emit(this.surveyQuestionResponse);
  }

}
