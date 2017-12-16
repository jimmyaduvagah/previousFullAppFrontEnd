import { Component, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../../../shared/services/user.service";
import { CategoryService } from "../../../shared/services/category.service";
import { LearningExperienceService } from "../../../shared/services/learning-experience.service";
import {
  ToastController, AlertController, NavController, Loading, LoadingController,
  ModalController
} from "ionic-angular";
import { LearningExperienceImageService } from "../../../shared/services/learning-experience-image.service";
import uuidv4 from 'uuid/v4';
import { SurveyService } from "../../../shared/services/survey.service";
import { editSurvey } from "../edit-survey/edit-survey";
import { addNewSurvey } from "../add-new-survey/add-new-survey";
import {listSurveyResponses} from "../list-survey-responses/list-survey-responses";

@Component({
  selector: 'page-list-survey',
  templateUrl: 'list-survey.html'
})

export class listSurvey {
  private surveyRes: any;
  private loading: boolean = false;
  private loadingController: Loading;
  private survey : any = {};

  constructor(
      private loadingCtrl: LoadingController,
      public _modalCtrl: ModalController,
      private _surveyService: SurveyService,
      private _toastCtrl: ToastController,
      private _alertCtrl: AlertController,
      private _navCtrl: NavController,

  ) {
     this.loadSurveys();
    }

  loadSurveys() {
    this.loading = true;
    this.showLoading();
    this._surveyService.getList().subscribe((res)=> {
        this.surveyRes =  res;
        this.loading = false;
        this.hideLoading();
    }, (error)=> {
        console.log(error);
        this.loading = false;
        this.hideLoading();
        this.showToast('error loading surveys please try again');
    })
  }
  newSurvey() {
    this._navCtrl.setRoot(addNewSurvey);
  }
  surveyResponses(survey_id){
    this._navCtrl.push(listSurveyResponses , {
      'survey_id': survey_id
    })
  }
  editSurvey(survey) {
    this._navCtrl.push(editSurvey , {
       'survey': survey
    })
  }
  deleteSurvey(id) {
    this.loading = true;
    let alert = this._alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this Survey?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.loading = false;

          }
        },
        {
          text: 'Delete',
          handler: () => {
                this._surveyService.delete(id).subscribe((res) => {
                let toast = this._toastCtrl.create({
                  message: 'Deleted LE '+id,
                  duration: 1500
                });
                toast.present();
                this.loadSurveys();
                this.loading = false;
                });
          }
        }
      ]
    });
    alert.present();
    return false;
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

}
