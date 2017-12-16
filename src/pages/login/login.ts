import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, ToastController } from 'ionic-angular';

import { SessionService } from '../../shared/services/session.service';
import { AuthService } from '../../shared/services/auth.service';
import { AuthUser } from '../../shared/models/AuthUser';
import { FeedPage } from '../feed/feed';
import { RegisterPage } from '../register/register';
import { StatusBar } from '@ionic-native/status-bar';
import { Device } from 'ionic-native';
import { twzColor } from '../../shared/utils/twz-color-util';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { MainTabs } from '../main-tabs/main-tabs';
import {DesktopComponent} from '../../desktop/desktop.component';
import { weakDeviceCheck } from '../../shared/utils/weakDevice';
import { SettingsService } from '../../shared/services/SettingsService';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { ENV } from '../../shared/constant/env';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public isWeakDevice: boolean = false;
  public user: AuthUser = new AuthUser({});
  private loading: boolean = false;
  private loadingController: Loading;
  constructor(private statusBar: StatusBar,
              private _nav: NavController,
              private _sessionService: SessionService,
              private _authService: AuthService,
              private loadingCtrl: LoadingController,
              private _toastCtrl: ToastController,
              private _settingsService: SettingsService,
              private _analytics: AnalyticsService
  ) {
    if (this._settingsService.getUserSetting('olderDeviceMode') == 'not set') {
      this._settingsService.setUserSetting('olderDeviceMode', weakDeviceCheck(Device));
    }
    this.isWeakDevice = this._settingsService.getUserSetting('olderDeviceMode');
    // this.statusBar.backgroundColorByHexString(twzColor.orangeDarkHex);

  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }

  showLoading() {
    this.loadingController = this.loadingCtrl.create({
      content: `Logging in`
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

  login() {
    this.loading = true;
    this.showLoading();
    this._authService.login(JSON.stringify(this.user)).subscribe((res) => {
        // this.loading = false;
        this.hideLoading();
        this._analytics.logEvent('user', 'logged-in');

      if (ENV.DESKTOP_MODE) {
        this._nav.setRoot(DesktopComponent);
      } else {
        if (this.isWeakDevice) {
          this._nav.setRoot(FeedPage);
        } else {
          this._nav.setRoot(MainTabs);
        }
      }

      },
      (errorMsg) => {
      this.hideLoading();
        this.loading = false;
        console.log(errorMsg);
        if (errorMsg.hasOwnProperty('non_field_errors')) {
          this.showToast(errorMsg.non_field_errors);
        } else if (errorMsg.hasOwnProperty('detail')) {
          this.showToast(errorMsg.detail);
        } else {
          let message = '';
          if (typeof errorMsg === 'string') {
            message = errorMsg;
          } else {
            for (let field in errorMsg) {
              if (errorMsg.hasOwnProperty(field)) {
                message = message + ' ' + field + ': ' + errorMsg[field];
              }
            }
          }
          this.showToast(message);
        }
      }
    );
  }

  goToRegister() {
    this._nav.push(RegisterPage);
  }

  goToForgotPassword() {
    this._nav.push(ForgotPasswordPage);
  }

  typed($event: KeyboardEvent) {
    if ($event.keyCode === 13) {
      this.login();
    }

  }

}
