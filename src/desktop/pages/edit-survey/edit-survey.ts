import { Component, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  ToastController, AlertController, NavController, Loading, LoadingController,
  ModalController, NavParams
} from "ionic-angular";
import uuidv4 from 'uuid/v4';
import { SurveyService } from "../../../shared/services/survey.service";
import { listSurvey } from "../list-survey/list-survey";
import * as _ from 'underscore';

@Component({
  selector: 'page-survey-edit',
  templateUrl: 'edit-survey.html'
})

export class editSurvey {
  private scaleForm: FormGroup;
  private groupForm: FormGroup;
  private surveytypeForm: FormGroup;
  private loading: boolean = false;
  private surveyForm: FormGroup;
  private loadingController: Loading;
  private activateSurvey: boolean = false;
  private questionForm: FormGroup;
  private  survey_groups : any = [];
  private survey : any = {};
  private answerForm: FormGroup;
  private showGroup: boolean = false;

  constructor(
      private loadingCtrl: LoadingController,
      private _surveyService: SurveyService,
      private _toastCtrl: ToastController,
      private _navCtrl: NavController,
      private _navParams: NavParams,
  ) {
    this.loading = true;
    // loadsurvey
    this.survey = this._navParams.get('survey');
    this.survey_groups = this.survey.groups;
    // functions
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
            let find = _.findWhere(this.survey_groups[g].questions[i].answers, {'title':'Other'});
            if(typeof(find) == 'undefined'){
               this.survey_groups[g].questions[i].answers.push({'title':'Other'});
            }
        }
      }
    }
    this.survey.groups = this.survey_groups;
    this._surveyService.put(this.survey.id, JSON.stringify(this.survey)).subscribe((res) => {
          console.log(res);
          this.hideLoading();
          this.showToast('survey edit was a success');
          this._navCtrl.setRoot(listSurvey);

      },
      (error) => {
          console.log(error);
          this.hideLoading();
          this.showToast('error submitting please try again');
      })

  }
  changeCollapseState(g,i, collapse) {
      if(collapse == true){
        this.survey_groups[g].questions[i].collapse = false;
      } else {
        this.survey_groups[g].questions[i].collapse = true;
      }
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
          this.survey_groups[groupIndex].questions[i].collapse = true;
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
  onChangeSurveyTitle($event) {
    this.survey.title = $event;
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
