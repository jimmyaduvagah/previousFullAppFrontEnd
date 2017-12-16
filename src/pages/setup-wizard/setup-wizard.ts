import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {
  NavController, ModalController, LoadingController, Loading, ViewController, Slides, ToastController
} from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { StatusBar } from '@ionic-native/status-bar';
import { SessionService } from "../../shared/services/session.service";
import { User } from "../../shared/models/User";
import { UserService } from "../../shared/services/user.service";
import { ImageViewPage } from "../image-view/image-view";
import { ModalSelectPage } from '../modal-select/modal-select';
import { NationalityService } from '../../shared/services/nationality.service';
import { ModalCountrySelectPage } from '../modal-country-select/modal-country-select';
import { PhoneNumberProvider } from '../../shared/services/PhoneNumberService';
import { PhotoService } from '../../shared/services/photo.service';
import { TownService } from '../../shared/services/town.service';
import { MainTabs } from '../main-tabs/main-tabs';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { LearningExperienceImage } from '../../shared/models/LearningExperience';
import { ENV } from '../../shared/constant/env';


@Component({
  selector: 'page-setup-wizard',
  templateUrl: 'setup-wizard.html'
})
export class SetupWizardPage implements AfterViewInit, OnDestroy {
  @ViewChild('imageInput')
  public imageInput;

  @ViewChild(Slides) slides: Slides;
  user: User;
  userId: string;
  isSelf: boolean = false;
  currentUser: User;
  saving: boolean = false;
  failedToSaveUser: boolean = false;
  loading: boolean = true;
  loadingController: Loading;
  private currentModal;
  private selectedPhoneCountry;
  private defaultUserImage: string = 'assets/imgs/user_male.png';
  private profileImagePreview;
  private disabledNextBtn: boolean = true;
  private hideNavBtns: boolean = false;
  private afterViewInit: boolean = false;

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
              public _viewController: ViewController,
              public phonenumber: PhoneNumberProvider,
              private _nav: NavController,
              private _nationalityService: NationalityService,
              private _townService: TownService,
              private _userService: UserService,
              private _sessionService: SessionService,
              private _toastCtrl: ToastController,
              private _photoService: PhotoService,
              private loadingCtrl: LoadingController,
              private _analytics: AnalyticsService
  ) {
    // this.statusBar.backgroundColorByHexString(twzColor.blueDarkHex);
    // setup initial phone country
    // this.selectedPhoneCountry = this.phonenumber.countries[0];

    this.showLoading();
    if (_sessionService.user) {
      this.currentUser = _sessionService.user;
      this.getUser();
    } else {
      let sub = _sessionService.userObservable.subscribe((user) => {
        this.currentUser = user;
        sub.unsubscribe();
        this.getUser();
      });
    }

  }


  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }

  showToast(msg) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
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

  getUser() {
    this._userService.getCurrentUser().subscribe((res) => {
      this.isSelf = true;
      this.user = res;
      this.userId = this.user.id;
      this.userLoaded();
    });
  }

  userLoaded() {
    this.loading = false;
    let countrySearch = this.phonenumber.countries.filter((country) => this.user.phone_country_code == country.iso2);
    console.log('countrySearch 1', countrySearch);
    if (countrySearch.length > 0) {
      this.selectedPhoneCountry = countrySearch[0];
    } else {

    }
    countrySearch = this.phonenumber.countries.filter((country) => this.user.phone_country_dial_code == country.dialCode);
    console.log('countrySearch 2', countrySearch);
    if (countrySearch.length > 0) {
      this.selectedPhoneCountry = countrySearch[0];
    }
    if (typeof this.selectedPhoneCountry !== "undefined") {
      this.user.phone_country_code = this.selectedPhoneCountry.iso2;
      this.user.phone_country_dial_code = '+' + this.selectedPhoneCountry.dialCode;
    }

    this.profileImagePreview = this.user.profile_image + '&r=500x500';
    countrySearch = null;

    this.hideLoading();
    this.disabledNextBtn = false;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.afterViewInit = true;
    }, 100);

  }

  ngOnDestroy() {
  }

  viewProfileImage() {
    if (typeof this.currentModal === 'undefined') {
      this.currentModal = this._modalCtrl.create(ImageViewPage, {
        imageSrc: this.user.profile_image
      });
      this.currentModal.onDidDismiss(data => {
        this.currentModal = undefined;
      });
      this.currentModal.present();
    }
  }

  setGender(gender) {
    this.user.gender = gender;
  }

  slideDidChange($event) {
    this.validateData();
  }

  slideWillChange($event) {
    this.slides.lockSwipeToNext(false);
  }

  validateData(all: boolean = false) {
    if (all) {
      if (this.selectedPhoneCountry) {
        let checks = [
          (typeof this.user.date_of_birth === 'undefined'),
          !(this.phonenumber.isValidMobile(this.user.phone_number, this.selectedPhoneCountry.iso2)),
          (!this.user.gender),
          (!this.profileImagePreview),
          (!this.user.nationality),
          (!this.user.town_of_residence),
          (!this.user.place_of_birth)
        ];
        for (let check of checks) {
          console.log('check', check);
          if (check === true) {
            this.disabledNextBtn = true;
            return false;
          }
        }
      } else {
        this.disabledNextBtn = true;
        return false;
      }

      return true;
    } else {
      switch(this.slides.getActiveIndex()) {
        case 0:
          this.disabledNextBtn = false;
          this.slides.lockSwipeToNext(false);
          break;
        case 1:
          if (typeof this.selectedPhoneCountry !== "undefined") {
            this.disabledNextBtn = !(this.phonenumber.isValidMobile(this.user.phone_number, this.selectedPhoneCountry.iso2));
            this.slides.lockSwipeToNext(!(this.phonenumber.isValidMobile(this.user.phone_number, this.selectedPhoneCountry.iso2)));
          } else {
            this.disabledNextBtn = true;
            this.slides.lockSwipeToNext(true);
          }
          break;
        case 2:
          console.log(this.user);
          this.disabledNextBtn = (!this.user.date_of_birth || !this.user.nationality || !this.user.town_of_residence || !this.user.place_of_birth);
          this.slides.lockSwipeToNext(!this.user.date_of_birth || !this.user.nationality || !this.user.town_of_residence || !this.user.place_of_birth);
          break;
        case 3:
          this.disabledNextBtn = (!this.user.gender || !this.profileImagePreview);
          this.slides.lockSwipeToNext(!this.user.gender || !this.profileImagePreview);
          break;
        case (this.slides._slides.length-1):
          this.hideNavBtns = true;
          this.slides.lockSwipeToNext(true);
          let toReturn = this.validateData(true);
          console.log('toReturn', toReturn);
          if (toReturn) {
            this.save();
          } else {
            this.hideNavBtns = false;
          }
          return toReturn;
      }
      return !this.disabledNextBtn;
    }
  }

  showSelectCountryModal($event, countryCodeInput) {
    // console.log('$event',$event);
    setTimeout(() => {
      countryCodeInput.blur.emit();
    }, 100);

    if (typeof this.currentModal === 'undefined') {
      this.currentModal = this._modalCtrl.create(ModalCountrySelectPage, {
        selected: this.user.phone_country_code
      });
      this.currentModal.onDidDismiss(data => {
        if (typeof data !== 'undefined') {
          this.selectedPhoneCountry = data;
          this.user.phone_country_code = data.iso2;
          this.user.phone_country_dial_code = '+' + data.dialCode;
          this.validateData();
        }
        this.currentModal = undefined;
      });
      this.currentModal.present();
    }
  }

  next() {
    if (this.validateData()) {
      this.slides.slideNext();
    }
  }

  prev() {
    this.slides.slidePrev();
  }

  getPicture() {
    this._photoService.actionSheet({
      allowEdit: true
    }).then((res) => {
      if (res !== undefined) {
        this.profileImagePreview = res;
        this.validateData();
      }
    });

  }

  selectTownOfBirth($event, townOfBirthInput) {
    setTimeout(() => {
      townOfBirthInput.blur.emit();
    },100);

    if (typeof this.currentModal === 'undefined') {
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
      this.currentModal = this._modalCtrl.create(ModalSelectPage, {
        user: this.user,
        titleField: 'name',
        allowCreateNew: true,
        returnOnSelect: true,
        createNewCallback: createNewFunction,
        searchCallback: searchFunction,
      });
      this.currentModal.onDidDismiss(data => {
        if (typeof data !== 'undefined') {
          // this.next();
          this.user.place_of_birth = data.name;
          this.validateData();
        }
        this.currentModal = undefined;
      });
      this.currentModal.present();
    }
  }
  selectTownOfResidence($event, townOfResidenceInput) {
    setTimeout(() => {
      townOfResidenceInput.blur.emit();
    },100);
    if (typeof this.currentModal === 'undefined') {
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
      this.currentModal = this._modalCtrl.create(ModalSelectPage, {
        user: this.user,
        titleField: 'name',
        allowCreateNew: true,
        returnOnSelect: true,
        createNewCallback: createNewFunction,
        searchCallback: searchFunction,
      });
      this.currentModal.onDidDismiss(data => {
        if (typeof data !== 'undefined') {

          // this.next();
          this.user.town_of_residence = data.name;
          this.validateData();
        }
        this.currentModal = undefined;
      });
      this.currentModal.present();
    }
  }

  selectNationality($event, nationalityInput) {
    setTimeout(() => {
      nationalityInput.blur.emit();
    },100);
    if (typeof this.currentModal === 'undefined') {
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
      this.currentModal = this._modalCtrl.create(ModalSelectPage, {
        user: this.user,
        titleField: 'name',
        allowCreateNew: true,
        returnOnSelect: true,
        createNewCallback: createNewFunction,
        searchCallback: searchFunction,
      });
      this.currentModal.onDidDismiss(data => {
        if (typeof data !== 'undefined') {
          this.user.nationality = data.name;
          this.validateData();
          // this.next();
        }
        this.currentModal = undefined;
      });
      this.currentModal.present();
    }

  }

  phoneChanged() {
    this.disabledNextBtn = !(this.phonenumber.isValidMobile(this.user.phone_number, this.selectedPhoneCountry.iso2));
  }

  dateOfBirthChanged(value) {
    this.disabledNextBtn = (typeof this.user.date_of_birth === 'undefined');
  }

  save() {
    this.saving = true;
    this.failedToSaveUser = false;
    let toSave = new User(this.user);
    if (typeof this.profileImagePreview !== "undefined" && this.profileImagePreview.match(/^data/)) {
      toSave.profile_image_base64 = this.profileImagePreview;
    }
    toSave.prepareForSave();
    this._userService.put(this.user.id + '/initial_setup', toSave).subscribe((res) => {
      this.user = res;
      this.saving = false;
      this._analytics.logEvent('user', 'completed-setup-wizard');
      toSave = null;
      this.completedInitialSetup();
    }, (error) => {
      this.saving = false;
      toSave = null;
      this.showToast('There has been an error saving your profile information. Please ensure you are connected to the internet and try again.');
      this.failedToSaveUser = true;

    });
  }

  completedInitialSetup() {
    this._nav.setRoot(MainTabs);
  }

  currentProgress() {
    return this.slides.progress * 100 + "%";
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
