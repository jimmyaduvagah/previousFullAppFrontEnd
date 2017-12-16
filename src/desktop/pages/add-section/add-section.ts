import { Component, Input } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, ToastController, AlertController } from 'ionic-angular';
import {
  SectionTextService,
  SectionImageService,
  SectionGalleryService,
  SectionVideoService,
  GalleryService,
  GalleryImageService
} from '../../../shared/services/learning-experience-sections.service';
import {
  SectionText,
  SectionGallery,
  SectionImage,
  SectionVideo
} from '../../../shared/models/LearningExperienceSections';
import { CourseModuleSectionsService } from '../../../shared/services/course-module-sections.service';
import { NewModuleSection } from "../new-module-section/new-module-section";
import { LearningExperienceImage } from '../../../shared/models/LearningExperience';
import { LearningExperienceImageService } from '../../../shared/services/learning-experience-image.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as showdown from 'showdown';
const converter = new showdown.Converter();

@Component({
  selector: 'page-add-section',
  templateUrl: 'add-section.html'
})
export class AddSection {

  section: string = 'sectionText';
  type = 'Text';
  public _sectionText: SectionText = new SectionText({});
  public _sectionGallery: SectionGallery = new SectionGallery({});
  public _sectionImage: SectionImage = new SectionImage({});
  public _sectionVideo: SectionVideo = new SectionVideo({});
  previewSection;
  leimage: File;
  leimages: any;
  limage: File;
  base64leImage: String = "";
  private loadText = false;
  private loadImage = false;
  private loadVideo = false;
  private loadGallery = false;
  private loadingController: Loading;
  private loading: boolean = true;
  private moduleData: any;
  private sectionTypesResponse: any = [];
  private leimageset: boolean = false;
  private imagele: LearningExperienceImage;
  private limagetype: any;
  private module: any;
  private module_id: any;
  private le: any;
  private leid: any;
  private videoForm: FormGroup;
  private galleryForm: FormGroup;
  private activeFormGroup: FormGroup;
  private galleryImages: any = [];
  private galleryImagesBase64Type: string[] = [];
  private galleryImagesBase64: string[] = [];
  private galleryImagesIds: string[] = [];
  private galleryID: string;
  private loadQuiz: boolean = false;
  private contentChangeInterval;
  private markdownPreview: string = "";


  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private _alertCtrl: AlertController,
              private _moduleSectionsService: CourseModuleSectionsService,
              private _sectionTextService: SectionTextService,
              private _sectionImageService: SectionImageService,
              private _sectionVideoService: SectionVideoService,
              private _sectionGalleryService: SectionGalleryService,
              private _imageService: LearningExperienceImageService,
              private _galleryService: GalleryService,
              private _galleryImageService: GalleryImageService) {
    //this.type = 'Text';

    converter.setFlavor('github');
    this.le = this.navParams.get('le');
    this.leid = this.navParams.get('leid');
    this.moduleData = this.navParams.get('moduleData');
    this.type = this.navParams.get('passtype');
    this.module = this.navParams.get('module');
    this.module_id = this.navParams.get('module_id');
    this.type = this.navParams.get('passtype');
    this.loadSection();
    this.getSectionTypes();

    this.contentChangeInterval = setInterval(() => {
      setTimeout(() => {
        this.contentChanged();
      });
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.contentChangeInterval);
  }

  contentChanged($event?) {
    // this.loadSection();



    // this.previewSection.html = markdown.toHTML(this.previewSection.text);
    // let update = this.activeFormGroup.getRawValue();
    //
    if (this.previewSection) {
      if (typeof this.previewSection.text !== 'undefined'){
        // most have a text field thats used for markdown
        this.previewSection.html = converter.makeHtml(this.previewSection.text);
        this.markdownPreview = converter.makeHtml(this.previewSection.text);
      }
      if (typeof this.previewSection.instructions !== 'undefined') {
        // quizzes have an instruction field that is used for markdown.
        this.previewSection.instructions_html = converter.makeHtml(this.previewSection.instructions);
        this.markdownPreview = converter.makeHtml(this.previewSection.text);
      }
    }

    if (this.activeFormGroup) {
      let update = this.activeFormGroup.getRawValue();

      if (typeof update.text !== 'undefined'){
        // most have a text field thats used for markdown
        this.markdownPreview = converter.makeHtml(update.text);
      }
      if (typeof update.instructions !== 'undefined') {
        // quizzes have an instruction field that is used for markdown.
        this.markdownPreview = converter.makeHtml(update.instructions);
      }
    }


    // Object.assign(this.section, update);
  }

  loadSection() {
    if (this.type == 'Text') {
      this.loadText = true;
      this.previewSection = this._sectionText;
      this.previewSection.type = 'text';
    } else if (this.type == 'Image') {
      this.loadImage = true;
      this.previewSection = this._sectionImage;
    } else if (this.type == 'Video') {
      this.loadVideo = true;
      // this.previewSection = this._sectionVideo;
      this.buildvideoForm();
    } else if (this.type == 'Gallery') {
      this.loadGallery = true;
      this.buildgalleryForm();
      this.previewSection = this._sectionGallery;
    } else if (this.type == 'Quiz') {
      this.loadQuiz = true;
      // this.previewSection = this._section
    }
  }

  showLoading(message="Saving..."){
    this.loadingController = this.loadingCtrl.create({
      content: message
    });
    this.loadingController.present();
  }

  hideLoading(){
    this.loadingController.dismiss();
  }

  buildvideoForm() {
    this.videoForm = new FormGroup({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      length: new FormControl('', Validators.required),
      vimeo_id: new FormControl('', Validators.required),
    });
    this.activeFormGroup = this.videoForm;
  }

  buildgalleryForm() {
    this.galleryForm = new FormGroup({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      images: new FormControl('-', Validators.required),
    });
    this.activeFormGroup = this.galleryForm;
  }

  public changeImage(event: EventTarget) {
    console.log('changing image');
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    if (files.length === 0) {
      this.leimageset = false;
    } else if(!files[0].type.includes('image')){
         let alert = this._alertCtrl.create({
          title: 'Error',
          subTitle: 'the selected file is not an image',
          buttons: ['Dismiss']
         });
        alert.present();
        this.leimageset = false;
    } else {
      this.leimageset = true;
      this.limage = files[0];
      this.limagetype = files[0].type;
      console.log(this.limage)
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.limage);
    }
  }

  public changeGalleryImages(event: EventTarget) {
    console.log('gallery images changed');
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    this.galleryImages = files;
    this.galleryImagesBase64 = [];
    this.galleryImagesBase64Type = [];
    for (var g = 0; g < this.galleryImages.length; g++) {
      this.galleryImagesBase64Type[g] = files[g].type;
      let reader = new FileReader();
      reader.onload = this._handleGreaderLoaded.bind(this);
      reader.readAsBinaryString(this.galleryImages[g]);
    }
  }

  _handleGreaderLoaded(readerEvt) {
    this.loading = true;
    let binaryString = readerEvt.target.result;
    this.galleryImagesBase64.push(btoa(binaryString));
    this.loading = false;
  }

  _handleReaderLoaded(readerEvt) {
    this.loading = true;
    let binaryString = readerEvt.target.result;
    this.base64leImage = btoa(binaryString);
    this.loading = false;
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

  addSectionText() {
    this.showLoading();
    this.loading = true;
    this._sectionTextService.post(JSON.stringify(this._sectionText))
      .subscribe((res) => {
          this.hideLoading();
          console.log(this.getSectionId('text'));
          this.moduleData['object_id'] = res.id;
          this.moduleData['course_module'] = this.moduleData['course_module_id'];
          this.moduleData['content_type'] = this.getSectionId('text');
          this._moduleSectionsService.post(JSON.stringify(this.moduleData))
            .subscribe((res) => {
              // this.toastCtrl.create({
              //   message: 'Text Section was successfully created',
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
                message: 'Save Error:  Failed to create/save the text section',
                duration: 5000,
                position: 'middle',
              }).present();
            });
        },
        (errorMsg) => {
          this.loading = false;
          this.hideLoading();
          console.log(errorMsg);
          this.toastCtrl.create({
            message: 'Save Error:  Failed to create/save the text section',
            duration: 5000,
            position: 'middle',
          }).present();
        });
  }

  addSectionImage() {
    this.showLoading();
    this.loading = true;
    let dataurl = 'data:' + this.limagetype + ';base64,';
    if(typeof this.base64leImage != "undefined") {
      this._imageService.upload64Image(JSON.stringify({"image": dataurl + this.base64leImage})).subscribe((res) => {
        this.loading = false;
        this.imagele = res;
        this._sectionImage.image_id = this.imagele.id;
        this._sectionImageService.post(JSON.stringify(this._sectionImage))
          .subscribe((res) => {
              this.hideLoading();
              this.moduleData['object_id'] = res.id;
              this.moduleData['course_module'] = this.moduleData['course_module_id'];
              this.moduleData['content_type'] = this.getSectionId('image');
              this._moduleSectionsService.post(JSON.stringify(this.moduleData))
                .subscribe((res) => {
                  // console.log('added course module');
                  // this.toastCtrl.create({
                  //   message: 'Image Section was successfully created',
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
                });
            },
            (errorMsg) => {
              this.loading = false;
              this.hideLoading();
              console.log(errorMsg);
              this.toastCtrl.create({
                message: 'Save Error:  Failed to create/save the image section',
                duration: 5000,
                position: 'middle',
              }).present();
              console.log(res);
            });
      }, (errors) => {
        this.loading = false;
        this.hideLoading();
        console.log(errors);
        let alert = this.toastCtrl.create({
          message: 'Failed to save uploaded image. Try again',
          duration: 5000,
          position: 'middle',
        });
        alert.present();
      });
    }else {
      this.hideLoading();
      let alert = this.toastCtrl.create({
          message: 'Failed to save uploaded image. Try again',
          duration: 5000,
          position: 'middle',
        });
      alert.present();
      // this.navCtrl.setRoot(NewModuleSection, {
      //               le: this.le,
      //               leid: this.leid,
      //               module: this.module,
      //               module_id: this.module.id
      // });
      // this.navCtrl.pop();
    }
  }

  addSectionVideo() {
    this.showLoading();
    this.loading = true;
    let videoData = this.videoForm.getRawValue();
    this._sectionVideoService.post(JSON.stringify(videoData)).subscribe((res) => {
        this.hideLoading();
        this.moduleData['object_id'] = res.id;
        this.moduleData['course_module'] = this.moduleData['course_module_id'];
        this.moduleData['content_type'] = this.getSectionId('video');
        this._moduleSectionsService.post(JSON.stringify(this.moduleData))
          .subscribe((res) => {
            // this.toastCtrl.create({
            //   message: 'Video Section was successfully created',
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
          });
      },
      (errorMsg) => {
        this.loading = false;
        this.hideLoading();
        console.log(errorMsg);
        this.toastCtrl.create({
          message: 'Save Error:  Failed to create/save the Video section',
          duration: 5000,
          position: 'middle',
        }).present();
      });
  }

  addSectionGallery() {

    // this.loading = true;
    console.log(this.galleryImagesBase64);

    // create the Gallery object
    this.showLoading('Creating Gallery...');
    this._galleryService.post(JSON.stringify({'title': this.galleryForm.getRawValue().title}))
      .subscribe((res) => {
        this.galleryID = res.id;

        let galleryData = this.galleryForm.getRawValue();

        // Create the Gallery Section object
        this._sectionGalleryService.post(JSON.stringify({
          'gallery': this.galleryID,
          'title': galleryData['title'], 'text': galleryData['text'], 'gallery_id': this.galleryID
        })).subscribe((res) => {
              this.moduleData['object_id'] = res.id;
              this.moduleData['course_module'] = this.moduleData['course_module_id'];
              this.moduleData['content_type'] = this.getSectionId('gallery');

              // Tie the Gallery Section object to a Module Section object.
              this._moduleSectionsService.post(JSON.stringify(this.moduleData))
                .subscribe((res) => {

                  let len = this.galleryImages.length;
                  this.hideLoading();

                  // Loop through all the images and add them to the Gallery object
                  let doneCount = 0;
                  this.showLoading('Uploading '+(len)+' Images...');
                  for (var i = 0; i < len; i++) {
                    let order = i;
                    let dataurl = 'data:' + this.galleryImagesBase64Type[i] + ';base64,';
                    this._imageService.upload64Image(JSON.stringify({"image": dataurl + this.galleryImagesBase64[i]}))
                        .subscribe((res) => {
                          let galImageId = res.id;
                          this.galleryImagesIds.push(res.id);
                          this._galleryImageService.post(JSON.stringify({
                            'order': order, 'image_id': galImageId,
                            'gallery_id': this.galleryID, 'gallery': this.galleryID
                          })).subscribe((res) => {
                            doneCount++;
                            if (doneCount == len) {
                              this.hideLoading();
                              this.navCtrl.pop();
                            }
                            console.log(res.id)
                          });
                        });
                  }

                }, (error) => {
                  this.hideLoading();
                  console.log(error);
                });
            },
            (errorMsg) => {
              // this.loading = false;
              this.hideLoading();
              console.log(errorMsg);
              this.toastCtrl.create({
                message: 'Save Error:  Failed to create/save the Image Gallery section',
                duration: 5000,
                position: 'middle',
              }).present();
            });
      }, (error) => {
        this.hideLoading();
        console.log(error);
        this.toastCtrl.create({
          message: 'Save Error:  Failed to create/save the Image Gallery section',
          duration: 5000,
          position: 'middle',
        }).present();
      });
    // this.loading = false;
    // this.hideLoading();
  }
}