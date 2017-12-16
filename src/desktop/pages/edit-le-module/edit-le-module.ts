import { Component, ViewChild } from '@angular/core';
import { LearningExperienceCategory, LearningExperienceImage } from '../../../shared/models/LearningExperience';
import { AlertController, Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ListLeModules } from '../list-le-modules/list-le-modules';
import { LearningExpereienceModuleService } from '../../../shared/services/course-module.service';
import { LearningExperienceImageService } from "../../../shared/services/learning-experience-image.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { LearningExperienceModule } from "../../../shared/models/LearningExperienceModule";
import { CourseModuleSectionsService } from '../../../shared/services/course-module-sections.service';
import { CourseModuleSection } from '../../../shared/models/CourseModuleSection';
import { NewModuleSection } from '../new-module-section/new-module-section';
import { AddSectionQuiz } from '../add-section-quiz/add-section-quiz';
import { AddSection } from '../add-section/add-section';
import { EditModuleSections } from '../edit-module-section/edit-module-section';
import { AddSectionSurvey } from "../add-section-survey/add-section-survey";
import {EditSectionSurvey} from "../edit-survey-section/edit-survey-section";


@Component({
  selector: 'edit-le-module',
  templateUrl: 'edit-le-module.html'
})
export class EditLeModule {
  sectionTypesResponse: any;

  @ViewChild('imageInput')
    public imageInput;

  public module_states: Array<{ title: string, value: string }> = [{
    title: "Published",
    value: "PUB"
  }, {title: "Not-Published", value: "NOP"}];

    public content_types: Array<{ title: string, value: string }> = [
        {
            title: "Text",
            value: "Text"
        },
        {
            title: "Image",
            value: "Image"
        },
        {
            title: "Video",
            value: "Video"
        },
        {
            title: "Gallery",
            value: "Gallery"
        },
        {
            title: "Quiz",
            value: "Quiz"
        },
        {
            title: "Survey",
            value: "Survey"
        },

    ];
  private module : LearningExperienceModule;
  private loadingController: Loading;
  private loading: boolean = true;
  private loadingSections: boolean = true;
  private le: any;
  moduleimage: File;
  modimage: File;
  base64Image: String = "";
  private imageset:boolean = false;
  private image: LearningExperienceImage;
  private imagetype: any;
  private leModuleForm: FormGroup;
    private addNewSection = {
        title: "Add New Section",
        image: {
            src: "assets/imgs/new-module-image.png",
            color: '#ffffff',
        }
    };
    private sectionsLoading: boolean = true;
    private moduleSections: CourseModuleSection[];

  constructor(
    public _navParams: NavParams,
    private _moduleService: LearningExpereienceModuleService,
    private _moduleSectionsService: CourseModuleSectionsService,
    private _nav: NavController,
    private loadingCtrl: LoadingController,
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
     private _imageService: LearningExperienceImageService,
  ) {
      this.getSectionTypes();
      this.le = this._navParams.get('le');
  }

    ionViewWillEnter() {
        // this is in here so when we pop back from editing/adding sections it refreshes the data
        this.getModule();
    }

  getModule() {
      this.loading = true;
      this.loadingSections = true;
      this._moduleService.get(this._navParams.get('module').id).subscribe((module) => {
          this.loading = false;
          this.module = module;
          console.log(this.module);

          this._moduleSectionsService.getFullList(this.module.id).subscribe((res) => {
              this.moduleSections = res.results;
              this.loadingSections = false;
          });

          this.buildleForm();

      });
  }

   buildleForm() {
    this.leModuleForm = new FormGroup({
      title: new FormControl(this.module.title),
      description: new FormControl(this.module.description),
      state: new FormControl(this.module.state),
      image_id: new FormControl(this.module.image_id),
      image_ip: new FormControl('-'),
      course: new FormControl(this.module.course),
    });
  }

  showLoading(message="Editing..."){
    this.loadingController = this.loadingCtrl.create({
      content: message
    });
    this.loadingController.present();
  }

  hideLoading(){
    this.loadingController.dismiss();
  }

   public changeImage(event: EventTarget) {
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
    } else {  this.imageset = true;
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

    base64Url() {
        return 'data:'+ this.imagetype + ';base64,' + this.base64Image;
    }

    clearImage() {
        this.imageset = false;
        this.base64Image = null;
        this.imagetype = null;
        this.modimage = null;
    }



  uploadModule () {
    // this.loading = true;

    if(this.imageset){
        this.showLoading('Uploading Image...');
      var dataurl = 'data:'+ this.imagetype + ';base64,';
      this._imageService.upload64Image(JSON.stringify({"image": dataurl+this.base64Image})).subscribe((imres) => {
        this.loading = false;
        this.image = imres;
        let toast = this._toastCtrl.create({
        message: 'image uploaded',
        duration: 1500
        });
        toast.present();
        this.hideLoading();
        this.editLeModule();
      }, (errors) => {
        this.hideLoading();
        console.log(errors);
        let alert = this._alertCtrl.create({
          title: 'Save Error',
          subTitle: 'Failed to Upload ' + errors,
          buttons: ['Dismiss']
        });
        alert.present();
      });
      }else {
      this.editLeModule();
    }
  }

  editLeModule(){
    this.showLoading('Saving Changes...');
    this.loading = true;
    let leData = this.leModuleForm.getRawValue();
    if(this.imageset){
       leData['image_id'] = this.image.id;
    }
    this._moduleService.put(this.module.id, JSON.stringify(leData))
      .subscribe((res)=>{
      let message = "LE Module successfully Edited";
      this.hideLoading();
      this._toastCtrl.create({
        message: message,
        duration: 1500,
        position: 'middle'
      }).present();
      // this._nav.setRoot(ListLeModules
      //     ,{
      //         leid: this.le.id , le: this.le,
      //         module_id: this.module.id,
      //         module: this.module,
      //
      //   });
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
                  text = text + "Le Module provided already exists.\n";
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

    focusImageInput() {
        // console.log('focusImageInput',  this.imageInput);
        this.imageInput.nativeElement.click();
    }


    // addNewModuleSection() {
    //     this._nav.push(NewModuleSection, {le:this.le, leid:this.le.id, module: this.module,module_id: this.module.id});
    // }

    addNewModuleSection() {
        let alert = this._alertCtrl.create();
        alert.setTitle('Section Type');

        for (let ct of this.content_types) {
            alert.addInput({
                type: 'radio',
                label: ct.title,
                value: ct.value,
                checked: false
            })
        }

        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: data => {
                console.log(data);
                let moduleData = {
                    content_type: data,
                    object_id: '-',
                    course_module_id: this.module.id

                };
                if(data =='Quiz' ){
                    this._nav.push(AddSectionQuiz, {le: this.le ,leid: this.le.id, passtype: data , moduleData: moduleData , module: this.module , module_id: this.module.id});
                } else if (data  == 'Survey') {
                    this._nav.push(AddSectionSurvey , {le: this.le ,leid: this.le.id, passtype: data , moduleData: moduleData , module: this.module , module_id: this.module.id});

                } else {
                    console.log({
                        le: this.le,
                        leid: this.le.id,
                        passtype: data,
                        moduleData: moduleData,
                        module: this.module,
                        module_id: this.module.id
                    });
                    this._nav.push(AddSection, {
                        le: this.le,
                        leid: this.le.id,
                        passtype: data,
                        moduleData: moduleData,
                        module: this.module,
                        module_id: this.module.id
                    });
                }
            }
        });
        alert.present();
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
    this._moduleSectionsService.getSectionTypes().subscribe((res) => {
      this.sectionTypesResponse = res;
    }, (error)=> {
       console.log(error);
    });
  }

  goToEditModuleSection(moduleSection, section_id) {
      console.log({
          leid: this.le.id,
          le: this.le,
          module_id :this.module.id,
          module: this.module,
          moduleSection: moduleSection,
          section_id: section_id,
      });
        if(this.getSectionTitle(moduleSection.content_type).includes('survey')){
              this._nav.push(EditSectionSurvey, {
                  leid: this.le.id,
                  le: this.le,
                  module_id :this.module.id,
                  module: this.module,
                  moduleSection: moduleSection,
                  section_id: section_id,
              });
        } else {
             this._nav.push(EditModuleSections, {
                  leid: this.le.id,
                  le: this.le,
                  module_id :this.module.id,
                  module: this.module,
                  moduleSection: moduleSection,
                  section_id: section_id,
              });
        }

    }





}






