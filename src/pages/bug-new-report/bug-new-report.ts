import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Device } from 'ionic-native';
import { ENV } from '../../shared/constant/env';
import { BugService } from "../../shared/services/bug.service";
import { SessionService } from '../../shared/services/session.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BugReportingPage } from "../bug-reporting/bug-reporting";
import { LearningExperienceImageService } from "../../shared/services/learning-experience-image.service";



@Component({
  selector: 'page-bug-new-report',
  templateUrl: 'bug-new-report.html'
})

export class NewBugReportPage {
    @ViewChild('imageInput')
    private imageInput;
  private title: string = '';
  private category: string = '';
  private description: string = '';
  private loadingController: Loading;
  private error;
  private loading_issues: boolean = true;
  private issues: any;
  private bugForm: FormGroup;
  private screenshot_image: boolean = false;
  private screenshot_file: File;
  private screenshot_type: String;
  private screenshot_image_b64: String;

  constructor(
              private loadingCtrl: LoadingController,
              private _bugService: BugService,
              private _toastCtrl: ToastController,
              private _sessionService: SessionService,
              private _nav: NavController,
              private _alertCtrl: AlertController,
              private _imageService: LearningExperienceImageService,

  )
  {
          this.buildbugForm();
  }
  buildbugForm() {
    this.bugForm = new FormGroup({
      title: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      screenshot: new FormControl(),
    });
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

  showToast(msg, duration=5000) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: duration,
      position: 'top'
    });
    toast.present();
  }

  submitBug() {
    let bugData = this.bugForm.getRawValue();
    this.title = bugData['title'];
    this.description = bugData['description'];
    this.category = bugData['category'];

    let userinfo = '\n\n\n\n----------------------\n\n* __Submitted By:__ ' + this._sessionService.user.getName() + '(' +this._sessionService.user.email +')';
    let deviceinfo = '\n* __Device:__ ' + Device.model + ' __OS:__ ' + Device.version;
    let versioninfo = '\n* __App Version:__ ' + ENV.APP_VERSION;
    this.showLoading('Submitting Bug');

    if(this.screenshot_image) {
        let dataurl = 'data:' + this.screenshot_type + ';base64,';
        this._imageService.upload64Image(JSON.stringify({"image": dataurl + this.screenshot_image_b64})).subscribe((res) => {
              let screenshot  = '\n* __Screenshot :__ ' + res.src;
              this._bugService.addIssue({
              title: this.title,
              category: [this.category],
              user_id: this._sessionService.user.id,
              description: this.description + userinfo + deviceinfo + versioninfo + screenshot
            }).subscribe((res) => {
              this.hideLoading();
              if (res) {
                this.showToast('thank you for your feedback');
                this.title = '';
                this.category = '';
                this.description ='';
                this._nav.popTo(BugReportingPage)
              }
            }, (err) => {
              this.hideLoading();
              if (err) {
                console.log(err);
                this.showToast('error submitting please try again');
              }
            });
          } , (error) => {
              this.hideLoading();
              this.showToast('error submitting image please try again');
              console.log(error)
          });
    } else {
      this._bugService.addIssue({
              title: this.title,
              category: this.category,
              user_id: this._sessionService.user.id,
              description: this.description + userinfo + deviceinfo + versioninfo
            }).subscribe((res) => {
              this.hideLoading();
              if (res) {
                this.showToast('thank you for your feedback');
                this.title = '';
                this.category = '';
                this.description ='';
                this._nav.popTo(BugReportingPage)
              }
            }, (err) => {
              this.hideLoading();
              if (err) {
                console.log(err);
                this.showToast('error submitting please try again');
              }
            });
    }

  }

   _handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    this.screenshot_image_b64 = btoa(binaryString);
   }

  changeImage(event: EventTarget) {
    console.log('changing image');
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    if (files.length === 0) {
      this.screenshot_image = false;
    } else if(!files[0].type.includes('image')){
         let alert = this._alertCtrl.create({
          title: 'Error',
          subTitle: 'the selected file is not an image',
          buttons: ['Dismiss']
         });
        alert.present();
        this.screenshot_image = false;
    } else {
      this.screenshot_image = true;
      this.screenshot_file = files[0];
      this.screenshot_type = files[0].type;
      console.log(this.screenshot_file)
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.screenshot_file);
    }
  }

  focusImageInput() {
      console.log('focusImageInput',  this.imageInput);
      this.imageInput.nativeElement.click();
  }



}
