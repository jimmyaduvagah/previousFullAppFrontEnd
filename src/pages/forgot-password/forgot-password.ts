import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { UserService } from "../../shared/services/user.service";
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  private loadingController: Loading;
  private loading: boolean = false;
  private email: string = '';

  constructor(private _nav: NavController,
              private loadingCtrl: LoadingController,
              private _userService: UserService,
              private _toastCtrl: ToastController,
              private _analytics: AnalyticsService) {

  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }

  showLoading() {
    this.loadingController = this.loadingCtrl.create({
      content: `Requesting password reset email`
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

  forgotPassword() {
    let tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    let valid = false;
    if(this.email.length > 254 || this.email.length < 5) {
      valid = false;
    } else {
      valid = tester.test(this.email);
    }

    if (!valid) {
      this.showToast('Please enter a valid email address.');
    } else {
      this.requestEmail();
    }
  }

  goToLogin() {
    this._nav.setRoot(LoginPage);
  }

  goToRegister() {
    this._nav.setRoot(RegisterPage);
  }

  typed($event) {
    if ($event.keyCode === 13) {
      this.forgotPassword();
    }
  }

  requestEmail() {
    this.showLoading();
    this._userService.passwordReset({
      email: this.email
    }).subscribe((res) => {
      if (res.hasOwnProperty('detail')) {
        this.hideLoading();
        this._analytics.logEvent('user', 'forgot-password-request');
        this.showToast(res.detail);
        setTimeout(() => {
          this.goToLogin();
        }, 100);
      }
    }, (err) => {
      this.hideLoading();
      if (err.hasOwnProperty('detail')) {
        this.showToast(err.detail);
      } else {
        this.showToast('An error occurred, please try again.');
      }
    });
  }
}
