import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserService } from "../../shared/services/user.service";
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html'
})
export class ChangePasswordPage {
  private password: string = '';
  private new_password: string = '';
  private new_password_again: string = '';
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
    if (this.new_password.length < 8) {
      this.error = 'Password must be 8 characters or more.';
      return false;
    }
    if (this.new_password !== this.new_password_again) {
      this.error = 'Passwords must match';
      return false;
    }
    return true;
  }

  ngModelChanged($event) {
    this.checkPasswords();
  }

  typed($event) {
    if ($event.keyCode === 13) {
      this.changePassword();
    }
  }


  changePassword() {
    if (this.checkPasswords()) {
      this.showLoading();
      this._userService.passwordChange({
        old_password: this.password,
        new_password1: this.new_password,
        new_password2: this.new_password_again
      }).subscribe((res) => {
        this.hideLoading();
        if (res.hasOwnProperty('detail')) {
          this._analytics.logEvent('user', 'changed-password');
          this.showToast(res.detail);
        }
      }, (err) => {
        this.hideLoading();
        if (err.hasOwnProperty('detail')) {
          this.showToast(err.detail);
        }
        if (err.hasOwnProperty('old_password')) {
          this.showToast('The current password you entered doesn\'t match our records.');
        }
      });
    }
  }


}
