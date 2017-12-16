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
import { listSurvey } from "../list-survey/list-survey";

@Component({
  selector: 'page-survey-add-new',
  templateUrl: 'add-new-survey.html'
})

export class addNewSurvey {
  private scaleForm: FormGroup;
  private groupForm: FormGroup;
  private surveytypeForm: FormGroup;
  public  userResponse: any;
  private loading: boolean = false;
  private surveyForm: FormGroup;
  private base64leImage: String = "";
  private color: string = "";
  private loadingController: Loading;
  private activateSurvey: boolean = false;
  private questionForm: FormGroup;
  private survey_groups : any = [];
  private survey : any = {};
  private answerForm: FormGroup;
  private showGroup: boolean = false;

  constructor(
      private loadingCtrl: LoadingController,
      public _modalCtrl: ModalController,
      private _surveyService: SurveyService,
      private _toastCtrl: ToastController,
      private _navCtrl: NavController,

  ) {
    this.loading = true;
    this.buildsurveyForm();
    this.buildsurveytypeForm();
    this.buildquestionForm();
    this.buildanswerForm();
    this.buildgroupForm();
    this.buildscaleForm();
    this.loading = false;
    }

  buildsurveyForm() {
    this.surveyForm = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }

  buildgroupForm() {
    this.groupForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
  }

  buildquestionForm() {
    this.questionForm = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }

  buildanswerForm() {
    this.answerForm = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }

  buildsurveytypeForm() {
    this.surveytypeForm = new FormGroup({
      type: new FormControl('', Validators.required),
    });
  }

  buildscaleForm() {
    this.scaleForm = new FormGroup({
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required),
    });
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


  submitSurvey() {
    this.showLoading();
    for(let g = 0; g < this.survey_groups.length; g++){
      for (let i = 0; i < this.survey_groups[g].questions.length; i++){
        if(this.survey_groups[g].questions[i].type === 'checkbox-with-other' ||
        this.survey_groups[g].questions[i].type === 'radio-with-other'){
            this.survey_groups[g].questions[i].answers.push({'title':'Other'});
        }
      }
    }
    let survey = {"title":this.survey.title,'groups':this.survey_groups};
    this._surveyService.post(JSON.stringify(survey)).subscribe((res) => {
          console.log(res);
          this.hideLoading();
          this.showToast('the survey has been created successfully');
          this._navCtrl.setRoot(listSurvey);

      },
      (error) => {
          console.log(error);
          this.hideLoading();
          this.showToast('error submitting please try again');
      })

  }

  reorderOptions(g,i,indexes) {
    let element = this.survey_groups[g].questions[i].answers[indexes.from];
    this.survey_groups[g].questions[i].answers.splice(indexes.from, 1);
    this.survey_groups[g].questions[i].answers.splice(indexes.to, 0, element);
  }
  onChangeType(g, $event , i) {
    this.survey_groups[g].questions[i].type = $event;
    if($event == 'longtext' || $event == 'shorttext' || $event == 'scale') {
           this.survey_groups[g].questions[i].answers = null;
    }
  }
  onChangeQuestion(g, $event , i) {
    console.log($event);
    this.survey_groups[g].questions[i].question = $event;

  }
  onChangeGroupTitle(g, $event) {
    this.survey_groups[g].title = $event;
  }
  OnChangeGroupDescription(g, $event) {
    this.survey_groups[g].description = $event;
  }

  anotherGroup() {
     this.showGroup = true;
  }
  anotherQuestion() {
     this.activateSurvey = true;
  }
  addGroup() {
    this.activateSurvey = true;
    this.showGroup = false;
    let groupdata = this.groupForm.getRawValue();
    this.groupForm.reset();
    if( typeof (this.survey_groups[0]) === 'undefined'){
       this.survey_groups[0] = {'title': groupdata['title'], 'uuid':uuidv4(), 'description':groupdata['description']};
    } else {
       this.survey_groups.push({'title': groupdata['title'], 'uuid':uuidv4(), 'description':groupdata['description']});
    }
     console.log(this.survey_groups);
  }
  addSurvey() {
     this.showGroup = true;
     let surveydata = this.surveyForm.getRawValue();
     this.survey = {"title": surveydata['title']};
  }

  addQuestion(groupIndex) {
     this.activateSurvey = false;
     let questiondata = this.questionForm.getRawValue();
     let typedata = this.surveytypeForm.getRawValue();
     this.questionForm.reset();
     this.surveytypeForm.reset();

       if(typeof (this.survey_groups[groupIndex].questions) === 'undefined'){
          this.survey_groups[groupIndex].questions = [];
          this.survey_groups[groupIndex].questions[0] = {'question': questiondata['title'] , 'type': typedata['type'] ,  'uuid':uuidv4()};

       } else {
         this.survey_groups[groupIndex].questions.push({'question': questiondata['title'] , 'type': typedata['type'],  'uuid':uuidv4()})
       }
  }
  addAnswer(groupIndex,i) {
    let answerdata  = this.answerForm.getRawValue();
    console.log(answerdata['title']);
    this.answerForm.reset();

      if(typeof (this.survey_groups[groupIndex].questions[i].answers) === 'undefined') {

          this.survey_groups[groupIndex].questions[i].answers = [];
          this.survey_groups[groupIndex].questions[i].answers[0] = {'title': answerdata['title']};
      } else {
          this.survey_groups[groupIndex].questions[i].answers.push({'title': answerdata['title']});
      }

  }
  addScale(g,i) {
    let scaledata  = this.scaleForm.getRawValue();

    this.scaleForm.reset();

    this.survey_groups[g].questions[i].scale = [scaledata['start'],scaledata['end']];

  }
  onChangeScaleStart(g,i,$event) {
    this.survey_groups[g].questions[i].scale[0] = $event;
  }

  onChangeScaleEnd(g,i,$event) {
    this.survey_groups[g].questions[i].scale[1] = $event;
  }

  removeAnswer(groupIndex ,i , a) {
    this.survey_groups[groupIndex].questions[i].answers.splice(a, 1);;
  }

  removeQuestion(g,i){
    this.survey_groups[g].questions.splice(i, 1);;
  }

  removeGroup(g){
    this.survey_groups.splice(g, 1);;
  }
}
