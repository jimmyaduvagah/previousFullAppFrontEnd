import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SurveyService } from "../../../shared/services/survey.service";
import * as _ from 'underscore';
import { SurveySectionService } from "../../../shared/services/survey-section.service";
import { CourseModuleSectionsService } from "../../../shared/services/course-module-sections.service";

@Component({
  selector: 'survey-response-details',
  templateUrl: 'survey-response-details.html'
})
export class SurveyResponseDetails {
  section_id: any;
  section: any;
  moduleSection: any;
  sectionTypesResponse: any;
  private survey_groups: any = [];
  private loadingController;
  private loading: boolean = false;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
  ) {
    this.survey_groups = this.navParams.get('surveyAnswers');
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


}