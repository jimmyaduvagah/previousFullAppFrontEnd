import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import {
  NavController, ModalController, LoadingController, Loading, ViewController, ToastController, Modal, NavParams
} from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { StatusBar } from '@ionic-native/status-bar';
import { SessionService } from "../../shared/services/session.service";
import { User } from "../../shared/models/User";
import { UserService } from "../../shared/services/user.service";
import { ModalCountrySelectPage } from '../modal-country-select/modal-country-select';
import { PhoneNumberProvider } from '../../shared/services/PhoneNumberService';
import { Observable } from 'rxjs/Observable';
import { PhoneVerificationService } from '../../shared/services/phone-verification.service';
import { TWToastController } from '../../shared/modules/tw-toast/tw-toast-controller';
import { AnalyticsService } from '../../shared/services/analytics.service';


@Component({
  selector: 'page-change-phone',
  templateUrl: 'change-phone.html'
})
export class ChangeNumberPage implements AfterViewInit, OnDestroy {


  user: User;
  private loadingController: Loading;
  private currentModal: Modal;
  private selectedPhoneCountry;
  // private phone_country_code;
  // private phone_country_dial_code;
  // private phone_number;
  private newNumber = {phone_country_code:'', phone_country_dial_code:'', phone_number:''};
  private phoneIsValid: boolean = false;
  private callback: Function = (res) => {};

  constructor(public statusBar: StatusBar,
              public _modalCtrl: ModalController,
              public _feedService: PostService,
              public _viewController: ViewController,
              public _phoneNumberService: PhoneNumberProvider,
              public _phoneVerificationService: PhoneVerificationService,
              private _nav: NavController,
              private _navParams: NavParams,
              private _userService: UserService,
              private _twToastCtrl: TWToastController,
              private _sessionService: SessionService,
              private _toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private _analytics: AnalyticsService
  ) {
    let cb =  this._navParams.get('cb');
    if (cb) {
      this.callback = cb;
    }
    let user =  this._navParams.get('user');
    if (user) {
      this.user = user;
      // this.phone_country_code = user.phone_country_code;
      // this.phone_country_dial_code = user.phone_country_dial_code;
      // this.phone_number = user.phone_number;
      // this._phoneNumberService.getForISO2(user.phone_country_code).subscribe((res) => {
      //   this.selectedPhoneCountry = res;
      // });
      // this.phoneChanged();
    } else {
      this._nav.pop();
    }
  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }


  showToast(msg, duration=3000) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: duration,
      position: 'top'
    });
    toast.present();
  }

  showTWToast(msg, image?, cb?, duration=4000) {
    let opts = {
      message: msg,
      duration: duration,
      position: 'top'
    };
    if (cb) {
      opts['clickCallBack'] = cb;
    }
    if (image) {
      opts['image'] = image;
    }
    if (!this.statusBar.isVisible) {
      opts['cssClass'] = 'fullscreen';
    }
    let toast = this._twToastCtrl.create(opts);
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

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.callback = undefined;
  }

  checkNumber() {
    this.showLoading();
    this.save().subscribe((res) => {
      this.hideLoading();
      this.verifyNumber();
    },
    (err) => {
      console.log(err);
      this.hideLoading();
    });
  }

  public verifyNumber () {
    this._phoneVerificationService.presentVerifyNumber().subscribe((res) => {
      this.showToast('Your number is now verified');
      this.callback(this.user);
      this._nav.pop();
    }, (err) => {
      if (typeof err === 'string') {
        this.showTWToast(err, null, () => {
          this.verifyNumber();
        });
      } else {
        if (!err.hasOwnProperty('canceled')) {
          if (err.hasOwnProperty('detail')) {
            this.showToast(err['detail']);
          }
        }
      }
    });

  }


  phoneChanged($event?) {
    this.phoneIsValid = this._phoneNumberService.isValidMobile(this.newNumber.phone_number, this.newNumber.phone_country_code);
  }

  showSelectCountryModal($event, countryCodeInput) {
    // console.log('$event',$event);
    setTimeout(() => {
      countryCodeInput.blur.emit();
    }, 100);

    if (typeof this.currentModal === 'undefined') {
      this.currentModal = this._modalCtrl.create(ModalCountrySelectPage, {
        // selected: this.user.phone_country_code
      });
      this.currentModal.onDidDismiss(data => {
        if (typeof data !== 'undefined') {
          this.selectedPhoneCountry = data;
          this.newNumber.phone_country_code = data.iso2;
          this.newNumber.phone_country_dial_code = '+' + data.dialCode;
        }
        this.currentModal = undefined;
      });
      this.currentModal.present();
    }
  }


  save() {
    return Observable.create((subscriber) => {
      this._userService.patch(this.user.id, {
        phone_number: this.newNumber.phone_number,
        phone_country_code: this.newNumber.phone_country_code,
        verified_phone: false,
        phone_country_dial_code: this.newNumber.phone_country_dial_code
      }).subscribe((res) => {
        this.user = res;
        this._analytics.logEvent('user', 'changed-phone-number');
        subscriber.next(res);
        subscriber.complete();
      }, (error) => {
        this.showToast('There has been an error saving your new number. Please ensure you are connected to the internet and try again.');
        subscriber.error(error);
        subscriber.complete();

      });

      return () => {
        //cleanup
      };
    });
  }

}
