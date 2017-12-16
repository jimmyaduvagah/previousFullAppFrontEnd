import { Component, ViewChild } from '@angular/core';
import { AlertController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import {twzColor} from '../../shared/utils/twz-color-util';
import {SessionService} from '../../shared/services/session.service';
import {PostService} from '../../shared/services/post.service';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {LearningExpereienceModuleService} from "../../../shared/services/course-module.service";
import {NavController, NavParams } from 'ionic-angular';
import { LearningExperienceImage, LearningExperience } from "../../../shared/models/LearningExperience";
import { LearningExperienceImageService } from "../../../shared/services/learning-experience-image.service";



@Component({
  selector: 'page-le-module-new',
  templateUrl: 'new-le-module.html'
})

export class NewLeModule {
  @ViewChild('imageInput')
  public imageInput;

  public module_states: Array<{ title: string, value: string }> = [{
    title: "Published",
    value: "PUB"
  }, {title: "Not-Published", value: "NOP"}];
  private loading: boolean = true;
  private moduleForm: FormGroup;
  private leid:string;
  private module:any;
  moduleimage: File;
  modimage: File;
  base64Image: String = "";
  private imageset:boolean = false;
  private image: LearningExperienceImage;
  private imagetype: any;
  private le: LearningExperience;
  private loadingController: Loading;




  constructor(private _moduleService: LearningExpereienceModuleService,
              private _toastCtrl: ToastController,
              private _alertCtrl: AlertController,
              private navCtrl: NavController,
              private navParams: NavParams,
              private _imageService: LearningExperienceImageService,
              private loadingCtrl: LoadingController,
  ) {
    this.leid = this.navParams.get('leid');
    this.le = this.navParams.get('le');
     if (this.leid !== '') {
        // let toast = this._toastCtrl.create({
        // message: 'Adding module for the LE'+this.leid,
        // duration: 1500
        // });
        // toast.present();
      } else {
        let toast = this._toastCtrl.create({
        message: 'Failed to get LE',
        duration: 1500
        });
        toast.present();
      }
      this.buildmoduleForm();
  }


  buildmoduleForm() {
    this.moduleForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      course: new FormControl(this.leid, Validators.required),
      image_id: new FormControl('-', Validators.required),
      state: new FormControl('', Validators.required),
      image_ip: new FormControl('-'),
      deleted: new FormControl(false, Validators.required),
    });
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

  showLoading(message="Editing..."){
    this.loadingController = this.loadingCtrl.create({
      content: message
    });
    this.loadingController.present();
  }

  hideLoading(){
    this.loadingController.dismiss();
  }

  uploadModule () {
    // this.loading = true;
    if(!this.imageset) {
      let alert = this._alertCtrl.create({
      title: 'Save Error',
      subTitle: 'Please select an Module image to Proceed',
      buttons: ['Dismiss']

    });
      alert.present();
      // this.loading = false;
      return false;
    } else {
      var dataurl = 'data:'+ this.imagetype + ';base64,';
      this.showLoading('Uploading Image...');
      this._imageService.upload64Image( JSON.stringify({"image": dataurl+this.base64Image})).subscribe((imres) => {
        this.hideLoading();
        this.image = imres;
        this.postLeModule();
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
    }
  }

  postLeModule() {
    this.showLoading('Saving Module...');
    let moduleData = this.moduleForm.getRawValue();
    moduleData['image'] =  {
      "id":this.image.id,
      "src":this.image.src,
      "width":this.image.width,
      "height":this.image.height,
    };
    moduleData['image_id'] = this.image.id;
    this._moduleService.post(JSON.stringify(moduleData)).subscribe((res) => {
      this.hideLoading();
      this.module = res;
      // console.log(this.module.id);
      // let toast = this._toastCtrl.create({
      //   message: 'Learning Experience Module Created',
      //   duration: 1500
      // });
      // toast.present();

      // this.navCtrl.setRoot(NewModuleSection, {le:this.le, leid:this.leid, module: this.module,module_id: this.module.id});
      this.navCtrl.pop();
    }, (errors) => {
      this.hideLoading();
      console.log(errors);
      let alert = this._alertCtrl.create({
        title: 'Save Error',
        subTitle: 'Failed to create Learning Experience Module' + errors,
        buttons: ['Dismiss']
      });
      alert.present();
    });
  }

  focusImageInput() {
    // console.log('focusImageInput',  this.imageInput);
    this.imageInput.nativeElement.click();
  }


}
