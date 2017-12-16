import { Component, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../../../shared/services/user.service";
import { CategoryService } from "../../../shared/services/category.service";
import { LearningExperienceService } from "../../../shared/services/learning-experience.service";
import {
  ToastController, AlertController, NavController, Loading, LoadingController,
  ModalController, NavParams
} from "ionic-angular";
import { LearningExperienceImageService } from "../../../shared/services/learning-experience-image.service";
import uuidv4 from 'uuid/v4';
import { SurveyService } from "../../../shared/services/survey.service";
import { editSurvey } from "../edit-survey/edit-survey";
import { addNewSurvey } from "../add-new-survey/add-new-survey";
import {SurveyResponseService} from "../../../shared/services/survey-response.service";
import {SurveyResponseDetails} from "../survey-response-details/survey-response-details";

@Component({
  selector: 'page-list-survey-responses',
  templateUrl: 'list-survey-responses.html'
})

export class listSurveyResponses {
  survey_id: any;
  private surveyRes: any;
  private loading: boolean = false;
  private loadingController: Loading;
  private survey : any = {};

  constructor(
      private loadingCtrl: LoadingController,
      public _modalCtrl: ModalController,
      private _surveyResponseService: SurveyResponseService,
      private _toastCtrl: ToastController,
      private _alertCtrl: AlertController,
      private _navCtrl: NavController,
      private _navparams: NavParams,

  ) {
     this.survey_id = this._navparams.get('survey_id');
     this.loadSurveyResponses();

    }


  showLoading(){
    this.loadingController = this.loadingCtrl.create({
      content: `Loading...`
    });
    this.loadingController.present();
  }

  hideLoading(){
    this.loadingController.dismiss();
  }

  showToast(msg, duration=5000) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: duration,
      position: 'top'
    });
    toast.present();
  }

  loadSurveyResponses() {
    this.loading = true;
    this.showLoading();
    this._surveyResponseService.getList({'survey':this.survey_id}).subscribe((res)=> {
        this.surveyRes =  res;
        console.log(res);
        this.loading = false;
        this.hideLoading();
    }, (error)=> {
        console.log(error);
        this.loading = false;
        this.hideLoading();
        this.showToast('error loading surveys  responses please try again');
    })
  }

  responseDetails(surveyAnswers) {
    this._navCtrl.push(SurveyResponseDetails, {
      'surveyAnswers': surveyAnswers
    })
  }

}
