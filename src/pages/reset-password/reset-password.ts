import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthUser } from '../../shared/models/AuthUser';
import { RegisterPage } from '../register/register';
import { UserService } from "../../shared/services/user.service";
import { isArray } from "rxjs/util/isArray";
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage {
  private password: string = '';
  private password_again: string = '';
  private loadingController: Loading;
  private error;
  private uid;
  private token;

  constructor(private _nav: NavController,
              private _navParams: NavParams,
              private loadingCtrl: LoadingController,
              private _userService: UserService,
              private _toastCtrl: ToastController,
              private toastCtrl: ToastController,
              private _analytics: AnalyticsService) {
    this.uid = this._navParams.get('uid');
    this.token = this._navParams.get('token');

  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }

  showLoading() {
    this.loadingController = this.loadingCtrl.create({
      content: `Resetting password`
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

  checkPasswords() {
    this.error = undefined;
    if (this.password !== this.password_again) {
      this.error = 'Passwords must match';
      return false;
    }
    if (this.password.length < 8) {
      this.error = 'Password must be 8 characters or more.';
      return false;
    }
    return true;
  }

  passwordsChanged($event) {
    this.checkPasswords();
  }

  typed($event) {
    if ($event.keyCode === 13) {
      this.resetPassword();
    }
  }

  goToLogin() {
    this._nav.setRoot(LoginPage);
  }

  goToRegister() {
    this._nav.setRoot(RegisterPage);
  }


  resetPassword() {
    if (this.checkPasswords()) {
      this.showLoading();
      this._userService.passwordConfirm({
        uid: this.uid,
        token: this.token,
        new_password1: this.password,
        new_password2: this.password_again
      }).subscribe((res) => {
        this.hideLoading();
        if (res.hasOwnProperty('detail')) {
          this.showToast(res.detail);
          this._analytics.logEvent('user', 'reset-password');
          setTimeout(() => {
            this.goToLogin();
          }, 100);
        }
      }, (err) => {
        this.hideLoading();
        if (err.hasOwnProperty('detail')) {
          this.showToast(err.detail);
        }
        if (err.hasOwnProperty('token')) {
          this.showToast('Invalid password reset token.');
        }
      });
    }
  }


}
