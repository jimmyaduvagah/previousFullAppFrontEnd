import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { CourseModuleSectionsService } from '../../../shared/services/course-module-sections.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { QuizSectionService, SectionQuizService } from "../../../shared/services/learning-experience-sections.service";
import { QuestionSectionService } from "../../../shared/services/learning-experience-sections.service";
import { AnswerSectionService } from "../../../shared/services/learning-experience-sections.service";
import { Quiz, QuizQuestion } from "../../../shared/models/Quiz";
import { NewModuleSection } from "../new-module-section/new-module-section";


@Component({
  selector: 'add-section-quiz',
  templateUrl: 'add-section-quiz.html'
})
export class AddSectionQuiz {
  private le;
  private leid;
  private moduleData;
  private type;
  private module;
  private module_id;
  private loadingController;
  private quizForm: FormGroup;
  private questionForm: FormGroup;
  private answerForm: FormGroup;
  private loading: boolean = false;
  private quiz: any = [];
  private sectionTypesResponse: any = [];
  private quiz_questions: any = [];
  private quiz_answers: any = [];
  private quiz_question: any = [];
  private quizAdded: boolean = false;
  private questionsActive: boolean = false;
  private answerActive: boolean = false;
  private questionIndex: number;


  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private _moduleSectionsService: CourseModuleSectionsService,
              private _quizSectionService: QuizSectionService,
              private _questionSectionService: QuestionSectionService,
              private _answerSectionService: AnswerSectionService,
              private _toastCtrl: ToastController,
              private _alertCtrl: AlertController,
              private  _sectionQuizService: SectionQuizService,
  ) {
    //this.type = 'Text';

    this.le = this.navParams.get('le');
    this.leid = this.navParams.get('leid');
    this.moduleData = this.navParams.get('moduleData');
    this.type = this.navParams.get('passtype');
    this.module = this.navParams.get('module');
    this.module_id = this.navParams.get('module_id');
    this.type = this.navParams.get('passtype');
    this.buildquizForm();
    this.buildquestionForm();
    this.buildanswerForm();
    this.getSectionTypes();
  }
  getSectionTypes() {
    this.loading = true;
    this._moduleSectionsService.getSectionTypes().subscribe((res) => {
      this.sectionTypesResponse = res;
    });
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
  showLoading(message) {
    this.loadingController = this.loadingCtrl.create({
      content: message
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  buildquizForm() {
    this.quizForm = new FormGroup({
      title: new FormControl('', Validators.required),
      instructions: new FormControl('', Validators.required),
    });
  }

  buildquestionForm() {
    this.questionForm = new FormGroup({
      question: new FormControl('', Validators.required),
      quiz_id: new FormControl(''),
      correct: new FormControl(''),
    });
  }

  buildanswerForm() {
    this.answerForm = new FormGroup({
      answer: new FormControl('', Validators.required),
      quiz_question: new FormControl(''),
    });
  }

  addQuiz() {
    this.showLoading('Adding new Quiz');
    let quizData = this.quizForm.getRawValue();
    this.quiz = quizData;
    this.quizAdded = true;
    this.hideLoading();
  }

  addQuestion() {
    this.showLoading('Add new Question');
    let questionData = this.questionForm.getRawValue();
    this.quiz_questions.push(questionData);
    this.questionsActive = false;
    this.hideLoading();
  }
  removeQuestion(Array, Index) {
    Array.splice(Index, 1);
    this.quiz_questions = Array;
  }
  removeAnswer(Array,qIndex,Index) {
    Array.splice(Index, 1);
    this.quiz_questions[qIndex].answers  = Array;
  }
  addAnswer() {
    this.showLoading('Add new Answer');
    let answerData = this.answerForm.getRawValue();
     if(typeof this.quiz_questions[this.questionIndex].answers == 'undefined' ){
          this.quiz_questions[this.questionIndex].answers  = [];
     }
     this.quiz_questions[this.questionIndex].answers.push(answerData);
     this.answerActive = false;
     this.hideLoading();
  }

  submitQuiz() {
    let quizData = this.quiz;
    this._quizSectionService.post(JSON.stringify(quizData)).subscribe((res) => {
      this.quiz = res;
      console.log(res);
      this.submitQuestions();
     }, (error) => {
            console.log(error);
      });
  }


  submitQuestions() {
    let questionData = this.quiz_questions;
    let success = true;
    var s = 0;
    var e = this.quiz_questions.length;

    for(var i = 0; i < questionData.length; i++){
      questionData[i].quiz = this.quiz.id;
      questionData[i].quiz_id = this.quiz.id;
        questionData[i].order  = i;
        this._questionSectionService.post(JSON.stringify(questionData[i])).subscribe((res) => {
            this.quiz_question[i] = res;

            if(s < e ) {
                console.log(this.quiz_questions[s]);
                console.log(this.quiz_question[i].id);
                if(!this.submitAnswers(this.quiz_questions[s] ,this.quiz_question[i] ,this.quiz_questions[s].answers)){
                  success = false;
                };
                s++;
            }

        }, (error) => {
            success = false;
            console.log(error);
        });
    }

    if(success){

      this._sectionQuizService.post(JSON.stringify({'title':this.quiz.quiz , 'quiz_id':this.quiz.id})).subscribe((results)=>
      {

        this.moduleData['object_id'] = results.id;
        this.moduleData['course_module'] = this.moduleData['course_module_id'];
        this.moduleData['content_type'] = this.getSectionId('quiz');
        this._moduleSectionsService.post(JSON.stringify(this.moduleData))
          .subscribe((res) => {
            // this.toastCtrl.create({
            //   message: 'Quiz Section was successfully created',
            //   duration: 3000,
            //   position: 'middle'
            // }).present();
            // console.log('added course module');
            // this.navCtrl.setRoot(NewModuleSection, {
            //   le: this.le,
            //   leid: this.leid,
            //   module: this.module,
            //   module_id: this.module.id
            // });
            this.navCtrl.pop();

          }, (error) => {
            console.log(error);
            this.toastCtrl.create({
              message: 'Save Error:  Failed to create section',
              duration: 5000,
              position: 'middle',
            }).present();
          });
        }, (error) => {
            console.log(error);
            this.toastCtrl.create({
              message: 'Save Error:  Failed to create the section',
              duration: 5000,
              position: 'middle',
            }).present();
       });
    }

  }

  updateQuestion( question) {
        this._questionSectionService.put(question.id , JSON.stringify(question)).subscribe((res) => {
            console.log(res);
        }, (error) => {
            console.log(error);
        });
  }

  submitAnswers(question, question_id, answers ) {
      for(var r =0; r < answers.length; r++) {

         answers[r].quiz_question  = question_id.id;
         answers[r].quiz_question_id  = question_id.id;
         answers[r].order = r;

         this._answerSectionService.post(JSON.stringify(answers[r])).subscribe((res) => {
                console.log(res.answer+' '+question.correct);
                if(res.answer == question.correct){
                    question_id.correct_answer_id = res.id;
                    this.updateQuestion(question_id);
                }
            }, (error) => {
                console.log(error);
                return false;
            });
       }
       return true;
    }

  activateQuestions() {
    this.showLoading('loading form');
    this.questionsActive = true;
    this.hideLoading();
  }

  activateAnswer (index) {
    this.showLoading('loading form');
    this.questionIndex = index;
    this.answerActive = true;
    this.hideLoading();
  }

}