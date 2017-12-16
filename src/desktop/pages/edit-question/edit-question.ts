import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';
import { SessionService } from '../../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';
import { LearningExperienceModule } from "../../../shared/models/LearningExperienceModule";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EditModuleSections } from "../edit-module-section/edit-module-section";
import {
  QuestionSectionService,
  AnswerSectionService
} from "../../../shared/services/learning-experience-sections.service";



@Component({
  selector: 'edit-question',
  templateUrl: 'edit-question.html'
})
export class EditQuestion {


  public module: LearningExperienceModule;
  private module_id: string;
  private le: any;
  private leid: any;
  private section_id: any;
  private section: any;
  private moduleSection: any;
  private question: any;
  private question_id: any;
  private question_index: any;
  private loadingController: Loading;
  private questionForm: FormGroup;
  private answerForm: FormGroup;
  private showAnswerForm: boolean = false;

  constructor(
    public statusBar: StatusBar,
    public _nav: NavController,
    public _navParams: NavParams,
    public _sessionService: SessionService,
    private loadingCtrl: LoadingController,
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
    private _questionService: QuestionSectionService,
    private _answerSectionService: AnswerSectionService,
   )
  {
    this.module = this._navParams.get('module');
    this.module_id = this._navParams.get('module_id');
    this.moduleSection = this._navParams.get('moduleSection');
    this.section = this.moduleSection.related;
    this.leid = this._navParams.get('leid');
    this.le = this._navParams.get('le');
    this.section_id = this._navParams.get('section_id');
    this.question = this._navParams.get('question');
    this.question_id = this._navParams.get('question_id');
    this.question_index = this._navParams.get('question_index');

    // build question form
    this.showLoading();
    this.buildQuestionForm();
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


  buildQuestionForm() {
    this.questionForm = new FormGroup({
      question: new FormControl(this.question.question),
      correct_answer_id: new FormControl(this.question.correct_answer_id),
    });
  }

  buildAnswerForm() {
    this.answerForm = new FormGroup({
      answer: new FormControl('', Validators.required),
      quiz_question: new FormControl(this.question_id, Validators.required),
      quiz_question_id: new FormControl(this.question_id, Validators.required),
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

  editQuestion() {
    let question_id = this.question_id;
    let questionData  = this.questionForm.getRawValue();
    this._questionService.patch(question_id , JSON.stringify(questionData)).subscribe((res) => {
       console.log(res);
       let toast = this._toastCtrl.create({
          message: 'question updated',
          duration: 1500
        });
        toast.present();
        this.moduleSection.related.quiz.quiz_questions[this.question_index] = res;
        this.goToEditModuleSection();

    }, (error)=> {
       console.log(error);
    });
  }
  activateAnswerForm() {
    this.showAnswerForm = true;
  }
  addAnswer() {
    let answerdata = this.answerForm.getRawValue();

     this._answerSectionService.post(JSON.stringify(answerdata)).subscribe((res) => {
            this.moduleSection.related.quiz.quiz_questions[this.question_index].answers.push(res);
            console.log(res);
             let toast = this._toastCtrl.create({
                message: 'added new answer',
                duration: 1500
              });
              toast.present();

        }, (error) => {
            console.log(error);
            let toast = this._toastCtrl.create({
                message: 'failed to create new answer',
                duration: 1500
              });
              toast.present();
        });
   }



}
