import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, MenuController, App, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { AuthTokenService } from '../shared/services/authtoken.service';
import { SessionService } from '../shared/services/session.service';
import { UserService } from '../shared/services/user.service';
import { AppUpdateService } from "../shared/services/app-update.service";
import { Deploy, Push, PushToken } from '@ionic/cloud-angular';
import { Observable } from 'rxjs/Observable';
import { twzColor } from '../shared/utils/twz-color-util';
import { MainTabs } from '../pages/main-tabs/main-tabs';
import { SetupWizardPage } from '../pages/setup-wizard/setup-wizard';
import { PushTokenService } from '../shared/services/push-token.service';
import { FeedService } from '../shared/services/feed.service';
import { Deeplinks } from 'ionic-native';
import { Device } from 'ionic-native';
import { ENV } from '../shared/constant/env';
import { TWToastController } from '../shared/modules/tw-toast/tw-toast-controller';
import { SettingsPage } from '../pages/settings/settings';
import { NotificaionRoutingService } from '../shared/services/notification-routing.service';
import { Subscription } from 'rxjs/Subscription';
import { PhoneVerificationService } from '../shared/services/phone-verification.service';
import { FeedPage } from '../pages/feed/feed';
import { ProfilePage } from '../pages/profile/profile';
import { LearningExperienceListPage } from '../pages/learning-experience-list/learning-experience-list';
import { ContactsPage } from '../pages/contacts/contacts';
import { NotificationsPage } from '../pages/notifications/notifications';
import { weakDeviceCheck } from '../shared/utils/weakDevice';
import { SettingsService } from '../shared/services/SettingsService';
import { ResetPasswordPage } from "../pages/reset-password/reset-password";
import { BugReportingPage } from '../pages/bug-reporting/bug-reporting';
import { Keyboard } from '@ionic-native/keyboard';
import { AnalyticsService } from '../shared/services/analytics.service';
import { DesktopComponent } from '../desktop/desktop.component';
import { SurveyPage } from '../pages/survey/survey';
import { SubmissionListPage } from '../desktop/pages/submission-list/submission-list';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) _nav: Nav;
  public isWeakDevice: boolean = false;
  pages: any;
  rootPage: any = LoginPage;
  private pushSubscription: Subscription;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private _authToken: AuthTokenService,
              private _userService: UserService,
              private push: Push,
              private _deploy: Deploy,
              private _pushTokenService: PushTokenService,
              private _phoneVerificationService: PhoneVerificationService,
              private _keyboard: Keyboard,
              private _toastCtrl: ToastController,
              private _notificationRouting: NotificaionRoutingService,
              private _config: Config,
              private _twToastCtrl: TWToastController,
              private _appUpdate: AppUpdateService,
              private _sessionService: SessionService,
              private menu: MenuController,
              private _app: App,
              private _analyticsService: AnalyticsService,
              private _feedService: FeedService,
              private _settingsService: SettingsService) {


    if (this._settingsService.getUserSetting('olderDeviceMode') == 'not set') {
      this._settingsService.setUserSetting('olderDeviceMode', weakDeviceCheck(Device));
    }
    this.isWeakDevice = this._settingsService.getUserSetting('olderDeviceMode');



    if (this._sessionService.isLoggedIn()) {
      if (ENV.DESKTOP_MODE) {
        this.rootPage = DesktopComponent;
      } else {
        if (this.isWeakDevice) {
          this.menu.enable(false, 'mainmenu');
          this.rootPage = FeedPage;
        } else {
          this.rootPage = MainTabs;
        }
      }


    }

    this.initializeApp();

    this.pages = [
      {title: 'Feed', component: FeedPage, icon: 'md-paper'},
      {title: 'Learning Experiences', component: LearningExperienceListPage, icon: 'md-bulb'},
      {title: 'Profile', component: ProfilePage, icon: 'person'},
      {title: 'Contacts', component: ContactsPage, icon: 'people'},
      {title: 'Notifications', component: NotificationsPage, icon: 'notifications-outline'},
      {title: 'Settings', component: SettingsPage, icon: 'settings'},
      {title: 'Bug Report', component: BugReportingPage, icon: 'bug'},
      // {title: 'Logout', component: LogoutPage}
    ];

  }

  weakDeviceCheck() {

  }

  registerForNotifications() {
    this._notificationRouting.setup(this._nav);
    if (!Device.isVirtual && this.platform.is('cordova')) {
      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        this._pushTokenService.post({
          device_id: Device.uuid,
          app_version: ENV.APP_VERSION,
          device_manufacturer: Device.manufacturer,
          device_model: Device.model,
          device_version: Device.version,
          device_platform: Device.platform,
          push_group: ENV.PUSH_GROUP,
          token: t.token
        }).subscribe(() => {
          if (typeof this.pushSubscription !== 'undefined') {
            this.pushSubscription.unsubscribe();
          }
          this.pushSubscription = this.push.rx.notification()
            .subscribe((msg) => {
                let shouldShow = true;
                if (msg.payload.hasOwnProperty('created_by_id')) {
                  if (msg.payload['created_by_id'] === this._sessionService.user.id) {
                    shouldShow = false;
                  }
                }
                if (
                  this._sessionService.rootNav && shouldShow &&
                  msg.app.asleep === false && msg.app.closed === false
                ) {
                  let image = null;
                  if (msg.payload.hasOwnProperty('image')) {
                    image = msg.payload['image'];
                  }
                  this.showTWToast('<b>' + msg.title + '</b>', image, () => {
                    this._notificationRouting.routeTo(msg);
                  });
                }
                if (
                  this._sessionService.rootNav && shouldShow &&
                  ( msg.app.asleep === true || msg.app.closed === true )
                ) {
                  this._notificationRouting.routeTo(msg);
                }
            });
        });
      });
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('keyboardResizes', this._config.get('keyboardResizes'));
      this._analyticsService.init();
      this._analyticsService.logEvent('application', 'launch');
      this.listenToNav();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      this._keyboard.disableScroll(true);



      Deeplinks.routeWithNavController(this._nav, {
        '/twzClient/reset-password/:uid/:token': ResetPasswordPage
      }).subscribe((match) => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
        console.log('Successfully matched route', match);
      }, (nomatch) => {
        // nomatch.$link - the full link data
        console.error('Got a deeplink that didn\'t match', nomatch);
      });

      // this.statusBar.backgroundColorByHexString(twzColor.orangeDarkHex);
      this.statusBar.backgroundColorByHexString(twzColor.blueDarkHex);
      this.splashScreen.hide();

      if (this._sessionService.isLoggedIn()) {
        this._sessionService.authStatus.emit(true);
        this.setupCurrentUser();
      }
      this._sessionService.authStatus.subscribe((res) => {
        if (res.authenticated === true) {
          this.setupCurrentUser();
        } else {
          this.clearCurrentUser();
        }
      });

      if (this.platform.is('cordova')) {
        this.checkForNewVersion().subscribe((newVersionAvailable) => {
          if (newVersionAvailable) {
            this.showTWToast('Update Available', null, () => {
              this._sessionService.rootNav.push(SettingsPage);
            });
          }
        });
      }

    });
  }

  listenToNav() {
    this._nav.viewDidEnter.subscribe((view) => {
      console.log('nav', view);
    });
  }

  showToast(msg, duration=4000) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: duration,
      position: 'top'
    });
    toast.present();
  }

  showTWToast(msg, image?, cb?) {
    let opts = {
      message: msg,
      duration: 5000,
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

  checkForNewVersion() {
    return Observable.create(observer => {
      this._deploy.check().then((snapshotAvailable: boolean) => {
        observer.next(snapshotAvailable);
        observer.complete();
      });
      return () => {
        //cleanup
      };
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this._nav.setRoot(page.component);
  }

  public setupCurrentUser() {
    this._userService.getCurrentUser().subscribe((res) => {
      this._sessionService.setUser(res);
      this.registerForNotifications();
      if (!this.doesUserHaveProfile()) {
        this._nav.setRoot(SetupWizardPage);
      } else {
        this.verifyNumber(res);
      }
    }, (error) => {
      // TODO: go to login page
    });
  }

  public verifyNumber (user) {
    if ((user.phone_number && user.phone_country_dial_code) && user.verified_phone === false) {
      this._phoneVerificationService.presentVerifyNumber().subscribe((res) => {
        this.showToast('Your number is now verified');
      }, (err) => {
        if (typeof err === 'string') {
          this.showTWToast(err, null, () => {
            this.verifyNumber(user);
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

  }

  public clearCurrentUser() {
    console.log('clearing current user');
  }

  public doesUserHaveProfile() {
    return this._sessionService.user.completed_initial_setup;
  }
}
