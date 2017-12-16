import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SurveyService } from "../../../shared/services/survey.service";
import * as _ from 'underscore';
import { SurveySectionService } from "../../../shared/services/survey-section.service";
import { CourseModuleSectionsService } from "../../../shared/services/course-module-sections.service";

@Component({
  selector: 'edit-survey-section',
  templateUrl: 'edit-survey-section.html'
})
export class EditSectionSurvey {
  section_id: any;
  section: any;
  moduleSection: any;
  sectionTypesResponse: any;
  private survey_groups: any = [];
  private survey: any = {};
  private surveyRes: any;
  private surveyForm: FormGroup;
  private le;
  private leid;
  private moduleData;
  private type;
  private module;
  private module_id;
  private loadingController;
  private loading: boolean = false;
  private surveySet: boolean = true;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private _surveyService: SurveyService,
              private _surveySectionService: SurveySectionService,
              private _moduleSectionsService: CourseModuleSectionsService,
  ) {
    //this.type = 'Text';
    this.le = this.navParams.get('le');
    this.leid = this.navParams.get('leid');
    this.moduleData = this.navParams.get('moduleData');
    this.type = this.navParams.get('passtype');
    this.module = this.navParams.get('module');
    this.module_id = this.navParams.get('module_id');
    this.type = this.navParams.get('passtype');
    this.moduleSection = this.navParams.get('moduleSection');
    this.section = this.moduleSection.related;
    this.section_id = this.navParams.get('section_id');

    this.getsurveyList();
    this.buildsurveyForm();
    this.getSectionTypes();

  }
  showLoading(message) {
    this.loadingController = this.loadingCtrl.create({
      content: message
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  buildsurveyForm() {
    this.surveyForm = new FormGroup({
      survey: new FormControl(this.section.survey, Validators.required),
      survey_group_id: new FormControl(this.section.survey_group_id, Validators.required),
    });
}

  onSurveyChange($event) {
    if($event!==''){
      this.surveySet = true
    } else {
       this.surveySet = false
    }
    this.survey = _.filter(this.surveyRes.results ,function(element){
    return element.id == $event
    });
    this.survey_groups = this.survey[0].groups;
    console.log(this.survey[0]);
    console.log(this.survey_groups);
  }
  getSectionTypes() {
    this.loading = true;
    this._moduleSectionsService.getSectionTypes().subscribe((res) => {
      this.sectionTypesResponse = res;
    });
  }
  getsurveyList() {
    this.loading = true;
    this._surveyService.getList().subscribe((res)=> {
      this.surveyRes = res;
      console.log({'res':this.surveyRes});
      for(let s =0; s < this.surveyRes.results.length; s++){
          if(this.surveyRes.results[s].id == this.section.survey){
            this.survey = this.surveyRes.results[s];
            this.survey_groups = this.survey.groups;
            console.log(this.survey);
          }
      }
      this.loading = false;

    }, (error) => {
      this.loading = false;
      console.log(error);
    })
  }
  getSectionId(string) {
    let sectionArray = this.sectionTypesResponse;
    let i = 0, len = sectionArray.length;
    for (; i < len; i++) {
      console.log(sectionArray[i].type);
      if (sectionArray[i].type.includes(string)) {
        return sectionArray[i].id;
      }
    }
    return "unknown";
  }


  addSurveySection() {
    this.showLoading('submitting survey section');
    let surveydata = this.surveyForm.getRawValue();

    this._surveySectionService.put(this.section.id, JSON.stringify(surveydata)).subscribe((res)=>{
        this.hideLoading();
        this.navCtrl.pop();
      },(error)=>{
          console.log(error);
          this.hideLoading();
          this.toastCtrl.create({
            message: 'Save Error:  Failed to create the section',
            duration: 5000,
            position: 'middle',
          }).present();
       });
   }


}