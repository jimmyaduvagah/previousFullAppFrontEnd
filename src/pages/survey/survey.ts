import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { LearningExperienceService } from '../../shared/services/learning-experience.service';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { Survey, SurveyGroup, SurveyQuestionResponse, SurveyResponse } from '../../shared/models/Survey';
import { SurveyService } from '../../shared/services/survey.service';
import { SurveyResponseService } from '../../shared/services/survey-response.service';


@Component({
  selector: 'page-survey',
  templateUrl: 'survey.html'
})
export class SurveyPage implements OnDestroy, AfterViewInit {

  private loadingController: Loading;
  private loading: boolean = true;
  private survey: Survey;
  private surveyId: string = '663d8c6e-1196-4c6c-9abb-0746117f8641';
  private response: SurveyResponse;
  private tempResponses: any = {};

  constructor(
    private _nav: NavController,
    private _navParams: NavParams,
    private _leService: LearningExperienceService,
    private _sessionService: SessionService,
    private _surveyService: SurveyService,
    private _surveyResponseService: SurveyResponseService,
    private _toastCtrl: ToastController,
    private _loadingCtrl: LoadingController,
    private _analytics: AnalyticsService
  ) {
  }

  ionViewDidEnter() {
    this._analytics.logScreenView('Survey Page');
    this.getSurvey();
  }

  ngAfterViewInit() {
  }

  showLoading(msg = 'Loading') {
    this.loadingController = this._loadingCtrl.create({
      content: msg
    });
    this.loadingController.present();
  }

  showToast(msg, time=3000) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: time,
      position: 'top'
    });
    toast.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  ngOnDestroy() {
  }

  getSurvey() {
    this._surveyService.get(this.surveyId).subscribe((res: Survey) => {
      this.survey = res;
      this.response = new SurveyResponse({
        survey: this.survey.id,
        title: res.title,
        answer_data: []
      });
      this.loading = false;
    });
  }

  submitSurvey() {
    this.response.setAnswerData(this.buildResponse());
    this._surveyResponseService.post(JSON.stringify(this.response)).subscribe((res) => {
      console.log(res);
    }, (err) => {
      console.log(err);
    });
  }

  buildResponse() {
    let answers = [];
    for (let groupIndex in this.survey.groups) {
      answers[groupIndex] = new SurveyGroup({
        uuid: this.survey.groups[groupIndex].uuid,
        title: this.survey.groups[groupIndex].title,
        description: this.survey.groups[groupIndex].description
      });
      answers[groupIndex].questions = [];
      console.log(this.survey.groups[groupIndex].questions);
      for (let index in this.survey.groups[groupIndex].questions) {
        console.log(this.survey.groups[groupIndex].questions[index].uuid);
        if (this.tempResponses.hasOwnProperty(this.survey.groups[groupIndex].questions[index].uuid)) {
          answers[groupIndex].questions.push(this.tempResponses[this.survey.groups[groupIndex].questions[index].uuid]);
        }
      }
    }
    return answers;
  }

  updateResponses($event) {
    this.tempResponses[$event.uuid] = $event;
    console.log(this.tempResponses);
  }

}
