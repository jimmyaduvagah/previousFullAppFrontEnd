import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, ToastController, AlertController } from 'ionic-angular';

import { SessionService } from '../../shared/services/session.service';
import { AuthService } from '../../shared/services/auth.service';
import { UserRegister } from '../../shared/models/User';
import { LoginPage } from '../login/login';
import { RegisterService } from '../../shared/services/register.service';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  public user: UserRegister = new UserRegister({});
  private loadingController: Loading;
  private loading: boolean = false;

  constructor(private _nav: NavController,
              private _sessionService: SessionService,
              private _authService: AuthService,
              private _registerService: RegisterService,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private _analytics: AnalyticsService) {

  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }

  showLoading() {
    this.loadingController = this.loadingCtrl.create({
      content: `Signing Up`
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  noInvitationCode() {
    let confirm = this.alertCtrl.create({
      title: 'No Invitation Code',
      message: 'Hey! Did you forget your invitation code?\nWithout one, you will be placed on the waiting list and unable to log in.',
      buttons: [
        {
          text: 'I Forgot',
          handler: () => {
            // console.log('I Forgot!');
          }
        },
        {
          text: "I Don't Have One",
          handler: () => {
            // console.log('Agree clicked');
            this.register();
          }
        }
      ]
    });
    confirm.present();
  }

  register() {
    let tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    let valid = false;
    if(this.user.email.length > 254 || this.user.email.length < 5) {
      valid = false;
    } else {
      valid = tester.test(this.user.email);
    }

    if (!valid) {
      this.toastCtrl.create({
        message: 'Please enter a valid email address.',
        duration: 3000,
        position: 'middle'
      }).present();
    } else {
      this.showLoading();
      this.loading = true;
      this._registerService.post(JSON.stringify(this.user))
        .subscribe((res) => {
            let activation_text = 'You will be able to log in after you verify your email.';
            this._analytics.logEvent('user', 'registered');
            if (res.hasOwnProperty('will_account_be_activated')) {
              if (res['will_account_be_activated'] === false) {
                activation_text = 'Unfortunately, sign up is by invitation only. Your account will be added to the waiting list.';
              }
            }
            let message = activation_text + " You will receive an email with a verification link. Please click the link to verify your email address.";
            this.loading = false;
            this.hideLoading();
            this.alertCtrl.create({
              title:'Thanks for Registering!',
              message: message,
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    this._nav.setRoot(LoginPage);
                  }
                }
              ]
            }).present();

          },
          (errorMsg) => {
            this.loading = false;
            this.hideLoading();
            let text = '';
            for (let field in errorMsg) {
              if (errorMsg.hasOwnProperty(field)) {
                if (field === 'username') {
                  if (errorMsg[field] === 'Username already exists.') {
                    text = text + "The provided email address has already been used to register.\n";
                  } else {
                    text = text + field + ': ' + errorMsg[field] + "\n";
                  }
                } else {
                  text = text + field + ': ' + errorMsg[field] + "\n";
                }
              }
            }
            if (errorMsg.hasOwnProperty('non_field_errors')) {
              text = text + errorMsg.non_field_errors;
            }
            this.toastCtrl.create({
              message: text,
              duration: 5000,
              position: 'middle'
            }).present();
          });
    }  }

  goToLogin() {
    this._nav.setRoot(LoginPage);
  }

}
