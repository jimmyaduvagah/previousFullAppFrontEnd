import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {
  NavController, ModalController, LoadingController, Loading,
  ToastController, NavParams
} from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { StatusBar } from '@ionic-native/status-bar';
import { SessionService } from "../../shared/services/session.service";
import { User } from "../../shared/models/User";
import { UserService } from "../../shared/services/user.service";
import { ExperienceService } from "../../shared/services/experience.service";
import { ImageViewPage } from "../image-view/image-view";
import { ModalSelectPage } from '../modal-select/modal-select';
import { NationalityService } from '../../shared/services/nationality.service';
import { TownService } from '../../shared/services/town.service';
import { PhotoService } from '../../shared/services/photo.service';
import { ChangeNumberPage } from '../change-phone/change-phone';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { ENV } from '../../shared/constant/env';
import { LearningExperienceImage } from '../../shared/models/LearningExperience';


@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html'
})
export class ProfileEditPage implements AfterViewInit, OnDestroy {

  @ViewChild('imageInput')
  public imageInput;

  user: User;
  userId: string;
  isSelf: boolean = false;
  loading: boolean = true;
  loadingController: Loading;
  private imageModal;
  private callback = (user) => {};
  private saving: boolean = false;
  private failedToSaveUser: boolean = false;
  private profileImagePreview;
  private desktopMode: boolean = ENV.DESKTOP_MODE;
  leImage: File;
  modimage: File;
  base64Image: String = "";
  private imageset:boolean = false;
  private image: LearningExperienceImage;
  private imagetype: any;


  constructor(public statusBar: StatusBar,
              public _modalCtrl: ModalController,
              public _feedService: PostService,
              private _navCtrl: NavController,
              private navParams: NavParams,
              private _nationalityService: NationalityService,
              private _userService: UserService,
              private _townService: TownService,
              private _sessionService: SessionService,
              private _toastCtrl: ToastController,
              private _experienceService: ExperienceService,
              private loadingCtrl: LoadingController,
              private _photoService: PhotoService,
              private _analytics: AnalyticsService
              ) {
    // this.statusBar.backgroundColorByHexString(twzColor.blueDarkHex);
    this.showLoading();

    let cb = this.navParams.get('callback');
    if (cb) {
      this.callback = cb;
    }
    this.getUser();

  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }

  showLoading() {
    this.loadingController = this.loadingCtrl.create({
      content: 'Loading'
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }
  showToast(msg) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  getUser() {
    this._userService.getCurrentUser().subscribe((res) => {
      this.isSelf = true;
      this.user = res;
      this.userId = this.user.id;
      this.userLoaded();
    }, (err) => {
      this.hideLoading();
      this.showToast('An error has occurred, please go back and try again.');
    });
  }

  userLoaded() {
    this.loading = false;
    this.hideLoading();
  }

  changePhone() {
    this._navCtrl.push(ChangeNumberPage, {
      user: this.user,
      cb: (res) => {
        this.user.phone_number = res.phone_number;
        this.user.phone_country_code = res.phone_country_code;
        this.user.phone_country_dial_code = res.phone_country_dial_code;
      }
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  viewProfileImage() {
    if (typeof this.imageModal === 'undefined') {
      this.imageModal = this._modalCtrl.create(ImageViewPage, {
        imageSrc: this.user.profile_image
      });
      this.imageModal.onDidDismiss(data => {
        this.imageModal = undefined;
      });
      this.imageModal.present();
    }
  }

  saveProfile() {
    this.save(() => {
      this._navCtrl.pop();
    });
  }

  getPicture() {
    this._photoService.actionSheet({
      allowEdit: true
    }).then((res) => {
      if (res !== undefined) {
        this.profileImagePreview = res;
      }
    });

  }

  save(cb: Function = () => {}) {
    this.showLoading();
    this.saving = true;
    this.failedToSaveUser = false;
    let prepared = new User(this.user);
    if (typeof this.profileImagePreview !== "undefined" && this.profileImagePreview.match(/^data/)) {
      prepared.profile_image_base64 = this.profileImagePreview;
    }
    prepared.prepareForSave();
    let toSave = {
      id: prepared.id,
      first_name: prepared.first_name,
      last_name: prepared.last_name,
      nationality: prepared.nationality,
      town_of_residence: prepared.town_of_residence,
      place_of_birth: prepared.place_of_birth,
      date_of_birth: prepared.date_of_birth,
      profile_image_base64: prepared.profile_image_base64
    };
    console.log(toSave);
    this._userService.patch(this.user.id, toSave).subscribe((res) => {
      this.user = res;
      this._sessionService.setUser(res);
      this.callback(res); // from previous page
      this.saving = false;
      toSave = null;
      this._analytics.logEvent('user', 'edited-profile');
      prepared = null;
      cb();
      this.hideLoading();
    }, (error) => {
      this.saving = false;
      toSave = null;
      prepared = null;
      this.showToast('There has been an error saving your profile information. Please ensure you are connected to the internet and try again.');
      this.hideLoading();
      this.failedToSaveUser = true;

    });
  }

  private selectNationalityModal;
  showSelectNationalityModal() {
    if (typeof this.selectNationalityModal === 'undefined') {
      let createNewFunction = (text, cb) => {
        this._nationalityService.post({
          name: text
        }).subscribe((res)=>{
          if (typeof cb !== 'undefined') {
            cb(res);
          }
        });
      };
      let searchFunction = (text, cb) => {
        this._nationalityService.getList({
          search: text
        }).subscribe((res)=>{
          if (typeof cb !== 'undefined') {
            cb(res.results);
          }
        });
      };
      this.selectNationalityModal = this._modalCtrl.create(ModalSelectPage, {
        titleField: 'name',
        allowCreateNew: true,
        returnOnSelect: true,
        createNewCallback: createNewFunction,
        searchCallback: searchFunction,
      });
      this.selectNationalityModal.onDidDismiss(data => {
        if (typeof data !== 'undefined') {
          this.user.nationality = data.name;
          this.user.nationality_id = data.id;
        }
        this.selectNationalityModal = undefined;
      });
      this.selectNationalityModal.present();
    }
  }

  private selectTownModal;
  showSelectTownModal(userField) {
    if (typeof this.selectTownModal === 'undefined') {
      let createNewFunction = (text, cb) => {
        this._townService.post({
          name: text
        }).subscribe((res)=>{
          if (typeof cb !== 'undefined') {
            cb(res);
          }
        });
      };
      let searchFunction = (text, cb) => {
        this._townService.getList({
          search: text
        }).subscribe((res)=>{
          if (typeof cb !== 'undefined') {
            cb(res.results);
          }
        });
      };
      this.selectTownModal = this._modalCtrl.create(ModalSelectPage, {
        titleField: 'name',
        allowCreateNew: true,
        returnOnSelect: true,
        createNewCallback: createNewFunction,
        searchCallback: searchFunction,
      });
      this.selectTownModal.onDidDismiss(data => {
        if (typeof data !== 'undefined') {
          this.user[userField] = data.name;
          this.user[userField + '_id'] = data.id;
        }
        this.selectTownModal = undefined;
      });
      this.selectTownModal.present();
    }
  }

  focusImageInput() {
    // console.log('focusImageInput',  this.imageInput);
    this.imageInput.nativeElement.click();
  }

  changeImage(event: EventTarget) {
    console.log('changing image');
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    if(files.length === 0 ) {
      this.imageset = false;

    } else if(!files[0].type.includes('image')){
      // let alert = this._alertCtrl.create({
      //   title: 'Error',
      //   subTitle: 'the selected file is not an image',
      //   buttons: ['Dismiss']
      // });
      // alert.present();
      // this.imageset = false;

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
    this.profileImagePreview = this.base64Url();
    this.loading = false;
  }

  base64Url() {
    return 'data:'+ this.imagetype + ';base64,' + this.base64Image;
  }

}
