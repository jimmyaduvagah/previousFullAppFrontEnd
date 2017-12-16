import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';
import { CourseModuleSectionsService } from '../../../shared/services/course-module-sections.service';
import { SessionService } from '../../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';
import { LearningExperienceModule } from "../../../shared/models/LearningExperienceModule";
import {
  SectionText,
  SectionGallery,
  SectionImage,
  SectionVideo
} from '../../../shared/models/LearningExperienceSections';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ListModuleSections } from "../list-module-sections/list-module-sections";
import {
  SectionTextService,
  SectionImageService,
  SectionGalleryService,
  SectionVideoService,
  GalleryService,
  GalleryImageService, QuizSectionService, QuestionSectionService, AnswerSectionService
} from '../../../shared/services/learning-experience-sections.service';
import { LearningExperienceImageService } from "../../../shared/services/learning-experience-image.service";
import { LearningExperienceImage } from "../../../shared/models/LearningExperience";
import { PopoverPage } from "../pop-over-page/pop-over";
import {EditQuestion} from "../edit-question/edit-question";
import { EditAnswer } from "../edit-answer/edit-answer";
import {EditGalleryImage} from "../edit-gallery-image/edit-gallery-image";
import * as showdown from 'showdown';
import { SurveyService } from "../../../shared/services/survey.service";
import { SurveySectionService } from "../../../shared/services/survey-section.service";
const converter = new showdown.Converter();
import * as _ from 'underscore';

@Component({
  selector: 'edit-module-section',
  templateUrl: 'edit-module-section.html'
})
export class EditModuleSections {
  private survey_id: any;
  private survey: any;
  private survey_groups: any;
  private surveyRes: any;
  private surveySet: boolean = false;
  public modulesSectionResponse: Response;
  public module: LearningExperienceModule;
  public _sectionText: SectionText ;
  public _sectionGallery: SectionGallery ;
  public _sectionImage: SectionImage ;
  public _sectionVideo: SectionVideo ;
  private loading: boolean = true;
  private module_id: string;
  private sectionTypesResponse: any =[];
  private le: any;
  private leid: any;
  private section_id: any;
  private section: any;
  private moduleSection: any;
  private textSectionForm: FormGroup;
  private loadingController: Loading;
  private imageSectionForm: FormGroup;
  private modimage: File;
  private base64Image: String = "";
  private imageset: boolean = false;
  private image: LearningExperienceImage;
  private imagetype: any;
  private videoForm: FormGroup;
  private galleryForm: FormGroup;
  private quizForm: FormGroup;
  private questionForm: FormGroup;
  private activeFormGroup: FormGroup;
  private showQuizForm: boolean = false;
  private showGallerySort: boolean = false;
  private showQuestionForm: boolean = false;
  private showQuestionSort: boolean = false;
  private showAnswerSort: boolean = false;
  private questionsOrdered: boolean = false;
  private answersOrdered: boolean = false;
  private imageToUpload: any;
  private moduleSectionChanged: boolean;
  private galleryreOrdered: boolean = false;
  private contentChangeInterval;
  private firstLoad: boolean = true;
  private surveyForm: FormGroup;



  constructor(
    public statusBar: StatusBar,
    public _nav: NavController,
    public _navParams: NavParams,
    public _moduleSectionsService: CourseModuleSectionsService,
    public _sessionService: SessionService,
    private loadingCtrl: LoadingController,
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
    private _sectionTextService: SectionTextService,
    private _sectionImageService: SectionImageService,
    private _sectionVideoService: SectionVideoService,
    private _sectionGalleryService: SectionGalleryService,
    private _imageService: LearningExperienceImageService,
    private _galleryService: GalleryService,
    private _galleryImageService: GalleryImageService,
    private popoverCtrl: PopoverController,
    private _quizService: QuizSectionService,
    private _questionService: QuestionSectionService,
    private _answerService: AnswerSectionService,
    private _surveyService: SurveyService,
    private _surveySectionService: SurveySectionService,

   )
  {
    this.module = this._navParams.get('module');
    this.module_id = this._navParams.get('module_id');
    this.moduleSectionChanged = this._navParams.get('galImageResult');
    this.moduleSection = this._navParams.get('moduleSection');
    this.section = this.moduleSection.related;
    console.log('the section is', this.section);
    this.leid = this._navParams.get('leid');
    this.le = this._navParams.get('le');
    this.section_id = this._navParams.get('section_id');
    this.getSectionTypes();
    this.imageToUpload =this._navParams.get('base64Image');
  }

  getSectionTitle(id) {
    let sectionArray = this.sectionTypesResponse;
     let i=0, len= sectionArray.length;
        for (; i<len; i++) {
            if (sectionArray[i].id === id) {
                return sectionArray[i].type;
            }
        }
     return "unknown";
  }

  getSectionTypes() {
    this.loading = true;
    this.showLoading();
    this._moduleSectionsService.getSectionTypes().subscribe((res) => {
      this.sectionTypesResponse = res;
      this.getLeModulesSections();
      if(this.getSectionTitle(this.moduleSection.content_type).includes('text')){
         this.textSectionBuildleForm();
      }
      if(this.getSectionTitle(this.moduleSection.content_type).includes('image')){
         this.imageSectionBuildleForm();
      }
      if(this.getSectionTitle(this.moduleSection.content_type).includes('video')){
         this.buildvideoForm();
      }
      if(this.getSectionTitle(this.moduleSection.content_type).includes('quiz')){
        this.buildquizForm();
        this.buildquestionForm();
      }
      if(this.getSectionTitle(this.moduleSection.content_type).includes('gallery')){
        this.buildGalleryForm();
      }
    });

      this.contentChangeInterval = setInterval(() => {
          setTimeout(() => {
              this.contentChanged();
          });
      }, 1000);
  }

  getLeModulesSections() {
      this._moduleSectionsService.getFullList(this.module_id).subscribe((res) => {
          this.modulesSectionResponse = res;
          console.log('moduleSectionRespsonse', this.modulesSectionResponse);
          for (let section of res.results) {
              if (this.moduleSection.id == section.id) {
                  console.log('we found the match...');
                  this.moduleSection = section;
                  this.section = this.moduleSection.related
                  break;
              }
          }
          this.loading = false;
          this.firstLoad = false;
          this.hideLoading();
      });
  }
  ionViewDidEnter() {
      if (!this.firstLoad) {
          this.getLeModulesSections();
      }

  }
  ngOnDestroy() {
      clearInterval(this.contentChangeInterval);
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
  }
  textSectionBuildleForm() {
    this.textSectionForm = new FormGroup({
      text: new FormControl(this.section.text),
      title: new FormControl(this.section.title),
        textColor: new FormControl(this.section.textColor),
        backgroundColor: new FormControl(this.section.backgroundColor),
    });
    this.activeFormGroup = this.textSectionForm;
  }
  contentChanged($event?) {
      let update = this.activeFormGroup.getRawValue();

      if (typeof update.text !== 'undefined'){
          // most have a text field thats used for markdown
          update.html = converter.makeHtml(update.text);
      }
      if (typeof update.instructions !== 'undefined') {
          // quizzes have an instruction field that is used for markdown.
          update.instructions_html = converter.makeHtml(update.instructions);
      }

      Object.assign(this.section, update);
    }
  imageSectionBuildleForm() {
    this.imageSectionForm = new FormGroup({
      text: new FormControl(this.section.text),
      title: new FormControl(this.section.title),
      image_id: new FormControl(this.section.image_id),
    });
      this.activeFormGroup = this.imageSectionForm;

  }
  buildvideoForm() {
    this.videoForm = new FormGroup({
      title: new FormControl(this.section.title),
      text: new FormControl(this.section.text),
      length: new FormControl(this.section.length),
      vimeo_id: new FormControl(this.section.vimeo_id),
    });
      this.activeFormGroup = this.videoForm;
  }
  buildGalleryForm() {
    this.galleryForm = new FormGroup({
      title: new FormControl(this.section.title),
      text: new FormControl(this.section.text)
    });
      this.activeFormGroup = this.galleryForm;
  }
  buildquizForm() {
    this.quizForm = new FormGroup({
      title: new FormControl(this.section.quiz.title),
      instructions: new FormControl(this.section.quiz.instructions),
    });
      this.activeFormGroup = this.quizForm;
  }
  buildquestionForm() {
    this.questionForm = new FormGroup({
      question: new FormControl('', Validators.required),
      quiz: new FormControl(this.section.quiz.id, Validators.required),
      quiz_id: new FormControl(this.section.quiz.id, Validators.required),
      correct: new FormControl(''),
    });
  }
  activateQuizForm() {
    this.showQuizForm = true;
  }
  activateQuestionForm() {
    this.showQuestionForm = true;
  }
  activateQuestionSort() {
     this.showQuestionSort = true;
  }
  deactivateQuestionSort() {
     this.showQuestionSort = false;
     if(this.questionsOrdered){
       this.updateQuestionOrder();
       this.questionsOrdered = false;
     }
  }
  activateAnswerSort() {
     this.showAnswerSort = true;
  }
  deactivateAnswerSort(index) {
     this.showAnswerSort = false;
     let success=false;
     for(let o = 0 ; o < this.section.quiz.quiz_questions[index].answers.length; o++) {
        this._answerService.patch(this.section.quiz.quiz_questions[index].answers[o].id, JSON.stringify({'order':o}))
            .subscribe((res)=>{
             success = true;
            console.log(res);
            },
            (errorMsg) => {
               console.log(errorMsg);
               success = false;
            });
    }
    if(success){
            let toast = this._toastCtrl.create({
                message: 'updated answers order',
                duration: 1500
              });
              toast.present();

   }
  }
  deleteQuestion(question_id , question_index) {
    this._questionService.delete(question_id).subscribe((res) => {
            this.section.quiz.quiz_questions.splice(question_index, 1);
            let toast = this._toastCtrl.create({
                message: 'deleted question',
                duration: 1500
              });
              toast.present();
    });
  }
  deleteAnswer(question_id , question_index, answer_id, answer_index ) {
    this._answerService.delete(answer_id).subscribe((res) => {
          this.section.quiz.quiz_questions[question_index].answers.splice(answer_index, 1);
          let toast = this._toastCtrl.create({
                message: 'deleted answer',
                duration: 1500
              });
              toast.present();
    });
  }
  updateQuestionOrder() {
    let success = false;
    for(var o = 0 ; o < this.section.quiz.quiz_questions.length; o++) {
        this._questionService.patch(this.section.quiz.quiz_questions[o].id, JSON.stringify({'order':o}))
            .subscribe((res)=>{
             success = true;
            console.log(res);
            },
            (errorMsg) => {
               console.log(errorMsg);
               success = false;
            });
    }
    if(success){
            let toast = this._toastCtrl.create({
                message: 'updated questions order',
                duration: 1500
              });
              toast.present();

   }
  }
  reorderQuestions(indexes) {
    let element = this.section.quiz.quiz_questions[indexes.from];
    this.section.quiz.quiz_questions.splice(indexes.from, 1);
    this.section.quiz.quiz_questions.splice(indexes.to, 0, element);
    console.log(indexes);
    this.questionsOrdered = true;
  }
  reorderAnswers(indexes , question_index) {
    let element = this.section.quiz.quiz_questions[question_index].answers[indexes.from];
    this.section.quiz.quiz_questions[question_index].answers.splice(indexes.from, 1);
    this.section.quiz.quiz_questions[question_index].answers.splice(indexes.to, 0, element);
    console.log(indexes);
    this.answersOrdered = true;
  }
  editQuiz() {
    let quiz_id = this.section.quiz.id;
    let quizData  = this.quizForm.getRawValue();
    this._quizService.patch(quiz_id , JSON.stringify(quizData)).subscribe((res) => {
       console.log(res);
       let toast = this._toastCtrl.create({
          message: 'quiz updated',
          duration: 1500
        });
        toast.present();
        this.showQuizForm = false;
        this.section.quiz.title = quizData.title;
        this.section.quiz.instructions = quizData.instructions;

    }, (error)=> {
       console.log(error);
    });
  }
  addQuestion() {
    let questionData = this.questionForm.getRawValue();
        this._questionService.post(JSON.stringify(questionData)).subscribe((res) => {
            console.log(res);
            // add question to questions
            this.section.quiz.quiz_questions.push(res);
            this.showQuestionForm = false;
             let toast = this._toastCtrl.create({
                message: 'added new question',
                duration: 1500
              });
              toast.present();

        }, (error) => {
            console.log(error);
            let toast = this._toastCtrl.create({
                message: 'failed to create question',
                duration: 1500
              });
              toast.present();
        });
    }
  goToEditQuestion(question, question_id , question_index) {
    this._nav.push(EditQuestion, {
      leid: this.le.id,
      le: this.le,
      module_id: this.module.id,
      module: this.module,
      moduleSection: this.moduleSection,
      section_id: this.section_id,
      question: question,
      question_id: question_id,
      question_index: question_index,
    });
  }
  goToEditAnswer(answer, answer_id ,answer_index , question_index) {
    this._nav.push(EditAnswer, {
      leid: this.le.id,
      le: this.le,
      module_id: this.module.id,
      module: this.module,
      moduleSection: this.moduleSection,
      section_id: this.section_id,
      answer: answer,
      answer_id: answer_id,
      answer_index: answer_index,
      question_index: question_index,
    });
  }
  changeImage(event: EventTarget) {
    console.log('changing image');
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    if(files.length === 0 ){
      this.imageset = false;
    } else if(!files[0].type.includes('image')){
         let alert = this._alertCtrl.create({
          title: 'Error',
          subTitle: 'the selected file is not an image',
          buttons: ['Dismiss']
         });
        alert.present();
        this.imageset = false;
    } else {
      this.imageset = true;
      this.modimage = files[0];
      this.imagetype = files[0].type;
      console.log(this.modimage)
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.modimage);
    }

  }
  _handleReaderLoaded(readerEvt) {
     this.loading = true;
     var binaryString = readerEvt.target.result;
            this.base64Image= btoa(binaryString);
     this.loading = false;
  }
  uploadImage() {
    this.loading = true;
    if(this.imageset) {
      var dataurl = 'data:' + this.imagetype + ';base64,';
      this._imageService.upload64Image(JSON.stringify({"image": dataurl + this.base64Image})).subscribe((imres) => {
        this.loading = false;
        this.image = imres;
        let toast = this._toastCtrl.create({
          message: 'image uploaded',
          duration: 1500
        });
        toast.present();
        this.editSectionImage();
      }, (errors) => {
        this.loading = false;
        console.log(errors);
        let alert = this._alertCtrl.create({
          title: 'Save Error',
          subTitle: 'Failed to Upload ' + errors,
          buttons: ['Dismiss']
        });
        alert.present();
      });
    } else {
      this.editSectionImage();
    }
  }
  editSectionText(){
    this.showLoading();
    this.loading = true;
    let sectionTextData = this.textSectionForm.getRawValue();
    this._sectionTextService.put(this.section.id, JSON.stringify(sectionTextData))
      .subscribe((res)=>{
      let message = "Text Section successfully Edited";
      this.hideLoading();
      this._toastCtrl.create({
        message: message,
        duration: 1500,
        position: 'middle'
      }).present();
      this._nav.pop();
      },
        (errorMsg) => {
          this.loading = false;
          this.hideLoading();
          let text = '';

          for (let field in errorMsg) {
            if (errorMsg.hasOwnProperty(field)) {
              if (field === 'title') {
                if (errorMsg[field] === 'Title already exist.') {
                  text = text + "Text Section provided already exists.\n";
                }
                else {
                  text = text + field + ':' + errorMsg[field] + "\n";
                }
              }
              else {
                text = text + field + ':' + errorMsg[field] + "\n";
              }
            }
          }
          if (errorMsg.hasOwnProperty('non_field_errors')){
            text = text + errorMsg.non_field_errors;
          }
          this._toastCtrl.create({
            message: text,
            duration: 5000,
            position: 'middle'
          }).present();
        });
  }
  editSectionImage(){
    this.showLoading();
    this.loading = true;
    let sectionImageData = this.imageSectionForm.getRawValue();
    if(this.imageset){
       sectionImageData['image_id'] = this.image.id;
    }
    this._sectionImageService.put(this.section.id, JSON.stringify(sectionImageData))
      .subscribe((res)=>{
      let message = "Image Section successfully Edited";
      this.hideLoading();
      this._toastCtrl.create({
        message: message,
        duration: 1500,
        position: 'middle'
      }).present();
      this._nav.pop();
      },
        (errorMsg) => {
          this.loading = false;
          this.hideLoading();
          let text = '';

          for (let field in errorMsg) {
            if (errorMsg.hasOwnProperty(field)) {
              if (field === 'title') {
                if (errorMsg[field] === 'Title already exist.') {
                  text = text + "Image Section provided already exists.\n";
                }
                else {
                  text = text + field + ':' + errorMsg[field] + "\n";
                }
              }
              else {
                text = text + field + ':' + errorMsg[field] + "\n";
              }
            }
          }
          if (errorMsg.hasOwnProperty('non_field_errors')){
            text = text + errorMsg.non_field_errors;
          }
          this._toastCtrl.create({
            message: text,
            duration: 5000,
            position: 'middle'
          }).present();
        });
  }
  editSectionVideo(){
    this.showLoading();
    this.loading = true;
    let sectionVideoData = this.videoForm.getRawValue();
    this._sectionVideoService.put(this.section.id, JSON.stringify(sectionVideoData))
      .subscribe((res)=>{
      let message = "Video Section successfully Edited";
      this.hideLoading();
      this._toastCtrl.create({
        message: message,
        duration: 1500,
        position: 'middle'
      }).present();
      this._nav.pop();
      },
        (errorMsg) => {
          this.loading = false;
          this.hideLoading();
          let text = '';

          for (let field in errorMsg) {
            if (errorMsg.hasOwnProperty(field)) {
              if (field === 'title') {
                if (errorMsg[field] === 'Title already exist.') {
                  text = text + "Text Section provided already exists.\n";
                }
                else {
                  text = text + field + ':' + errorMsg[field] + "\n";
                }
              }
              else {
                text = text + field + ':' + errorMsg[field] + "\n";
              }
            }
          }
          if (errorMsg.hasOwnProperty('non_field_errors')){
            text = text + errorMsg.non_field_errors;
          }
          this._toastCtrl.create({
            message: text,
            duration: 5000,
            position: 'middle'
          }).present();
        });
  }
  reorderGalleryimages(indexes) {
    console.log(indexes);
    let element = this.section.gallery.images[indexes.from];
    this.section.gallery.images.splice(indexes.from, 1);
    this.section.gallery.images.splice(indexes.to, 0, element);
    this.galleryreOrdered = true;
  }
  activateGallerySort() {
    this.showGallerySort  = true;
  }
  deactivateGallerySort() {
    this.showGallerySort  = false;
    if(this.galleryreOrdered){
      // update database
      this.galleryreOrdered = false;
    }

  }
  editGallerySection(){
    this.showLoading();
    this.loading = true;
    let galleryData = this.galleryForm.getRawValue();
    this._sectionGalleryService.put(this.section.id, JSON.stringify( {
      'gallery': this.section.gallery_id,
          'title': galleryData['title'], 'text': galleryData['text'], 'gallery_id': this.section.gallery_id
      })).subscribe((res)=>{
      let message = "Gallery Section successfully Edited";
      this.hideLoading();
      console.log(res);
      this._toastCtrl.create({
        message: message,
        duration: 1500,
        position: 'middle'
      }).present();
      this._nav.pop();
    },(errors) => {
      this.loading = false;
      this.hideLoading();
      let text = 'Failed to edit gallery section.Try again';
      this._toastCtrl.create({
        message: text,
        duration: 5000,
        position: 'middle'
      }).present();
    });
  }
  editGalleryImage(gal_id, galimgId, ord, img) {
    this._nav.push(EditGalleryImage, {
      gal_id: gal_id,
      galImg_id: galimgId,
      ord: ord,
      galimage: img,
      leid: this.le.id,
      le: this.le,
      module_id: this.module.id,
      module: this.module,
      moduleSection: this.moduleSection,
      section_id: this.section_id,
    });
  }
  deleteImage(gal_id , image_index) {
    this._galleryImageService.delete(gal_id).subscribe((res)=>{
          console.log(res);
          this.section.gallery.images.splice(image_index ,1);
          let toast = this._toastCtrl.create({
          message: 'image deleted',
          duration: 1500
        });
        toast.present();
      }, (errors) => {
        this.loading = false;
        console.log(errors);
        let alert = this._alertCtrl.create({
          title: 'Save Error',
          subTitle: 'Failed to delete image, Try again please',
          buttons: ['Dismiss']
        });
        alert.present();
      });
  }
  addNewGallaryImage(op, gal_id) {
    this._nav.push(EditGalleryImage, {leid: this.le.id , le: this.le,
      module_id: this.module.id, module: this.module, moduleSection: this.moduleSection,
      op: op, gal_id: gal_id});
  }
}
