import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';
import { SessionService } from '../../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';
import { LearningExperienceModule } from "../../../shared/models/LearningExperienceModule";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  AnswerSectionService
} from '../../../shared/services/learning-experience-sections.service';
import { EditModuleSections } from "../edit-module-section/edit-module-section";



@Component({
  selector: 'edit-answer',
  templateUrl: 'edit-answer.html'
})
export class EditAnswer {

  public module: LearningExperienceModule;
  private module_id: string;
  private le: any;
  private leid: any;
  private section_id: any;
  private section: any;
  private moduleSection: any;
  private answer: any;
  private answer_id: any;
  private loadingController: Loading;
  private answerForm: FormGroup;
  private question_index: any;
  private answer_index: any;



  constructor(
    public statusBar: StatusBar,
    public _nav: NavController,
    public _navParams: NavParams,
    public _sessionService: SessionService,
    private loadingCtrl: LoadingController,
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
    private _answerService: AnswerSectionService,
   )
  {
    this.module = this._navParams.get('module');
    this.module_id = this._navParams.get('module_id');
    this.moduleSection = this._navParams.get('moduleSection');
    this.section = this.moduleSection.related;
    this.leid = this._navParams.get('leid');
    this.le = this._navParams.get('le');
    this.section_id = this._navParams.get('section_id');
    this.answer = this._navParams.get('answer');
    this.answer_id = this._navParams.get('answer_id');
    this.answer_index = this._navParams.get('answer_index');
    this.question_index = this._navParams.get('question_index');


    // build answer form
    this.showLoading();
    this.buildAnswerForm();
    this.hideLoading();
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


  buildAnswerForm() {
    this.answerForm = new FormGroup({
      answer: new FormControl(this.answer.answer),
    });
  }

  goToEditModuleSection() {
    this._nav.popTo(EditModuleSections, {
      leid: this.le.id,
        le: this.le,
        module_id :this.module.id,
        module: this.module,
        moduleSection: this.moduleSection,
        section_id: this.section_id,
    });
  }
  editAnswer() {
    let answer_id = this.answer_id;
    let answerData  = this.answerForm.getRawValue();
    this._answerService.patch(answer_id , JSON.stringify(answerData)).subscribe((res) => {
       console.log(res);
       let toast = this._toastCtrl.create({
          message: 'answer updated',
          duration: 1500
        });
        toast.present();
        this.moduleSection.related.quiz.quiz_questions[this.question_index].answers[this.answer_index] = res;
        this.goToEditModuleSection();
    }, (error)=> {
       console.log(error);
    });
  }



}
