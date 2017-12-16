import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, AlertController, App } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { Page } from 'ionic-angular/navigation/nav-util';
import { DesktopComponent } from '../../desktop/desktop.component';
import { NotificationsPage } from '../notifications/notifications';
import { SessionService } from '../../shared/services/session.service';
import { User } from '../../shared/models/User';
import { ProfilePage } from '../profile/profile';
import { ChangePasswordPage } from "../change-password/change-password";
import { BugReportingPage } from "../bug-reporting/bug-reporting";
import { AnalyticsService } from '../../shared/services/analytics.service';


@Component({
  selector: 'page-more-pages',
  templateUrl: 'more-pages.html'
})
export class MorePagesPage implements AfterViewInit, OnDestroy {
  private rootNavCtrl: NavController;
  private settingsPage = SettingsPage;
  private changePasswordPage = ChangePasswordPage;
  private bugReportingPage = BugReportingPage;

  // private userImage;
  // private userSub;

  constructor(
              public alertCtrl: AlertController,
              public _nav: NavController,
              public _navParams: NavParams,
              private _app: App,
              private _sessionService: SessionService,
              private _analytics: AnalyticsService

  ) {
    // this.statusBar.backgroundColorByHexString(twzColor.orangeDarkHex);
    this.rootNavCtrl = _navParams.get('rootNavCtrl') || _nav;
    // if (_sessionService.user) {
    //   this.userImage = _sessionService.user.profile_image;
    // }
    // this.userSub = _sessionService.userObservable.subscribe((res) => {
    //   this.userImage = res.profile_image;
    // });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this._analytics.getSelectedTab() === 4) {
        this._analytics.logScreenView(this.constructor.name);
      }
    }, 250);
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    // this.userSub.unsubscribe();
  }

  goToMyProfile() {
    this.rootNavCtrl.push(ProfilePage);
  }

  goToDesktopComponent() {
    this.rootNavCtrl.setRoot(DesktopComponent);
  }

  goToNotifications() {
    this._app.getRootNav().push(NotificationsPage);
  }


  comingSoon(page: string) {
    let alert = this.alertCtrl.create({
      title: 'Coming Soon',
      subTitle: page + ' is coming soon...',
      buttons: ['OK']
    });
    alert.present();
  }

  goToDesktop() {
      this._nav.setRoot(DesktopComponent);
  }

  goTo(page: Page){
    this.rootNavCtrl.push(page);
  }

}
