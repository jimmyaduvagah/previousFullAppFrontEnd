import { Component } from '@angular/core';
import { NavController, ToastController, MenuController, App } from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { AuthService } from '../../shared/services/auth.service';
import { AuthUser } from '../../shared/models/AuthUser';
import { LoginPage } from '../login/login';
import { UserService } from '../../shared/services/user.service';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html'
})
export class LogoutPage {
  public user: AuthUser = new AuthUser({});

  constructor(public navCtrl: NavController,
              public _sessionService: SessionService,
              public _userService: UserService,
              public _authService: AuthService,
              public toastCtrl: ToastController,
              private menu: MenuController,
              private _app: App,
              private _analytics: AnalyticsService
  ) {
    this._userService.logout().subscribe((res) => {
      this._sessionService.logout();
      this._app.getRootNav().setRoot(LoginPage);
    }, (err) => {
      this._sessionService.logout();
      this._app.getRootNav().setRoot(LoginPage);
    });
  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
    this._analytics.logEvent('user', 'logged-out');
  }

}
