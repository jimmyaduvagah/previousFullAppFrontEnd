import { AfterViewInit, Component } from '@angular/core';
import {
  App, Loading, LoadingController, NavController, NavParams, AlertController, Platform,
  PopoverController
} from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { User } from '../../shared/models/User';
import { StatusBar } from '@ionic-native/status-bar';
import { Deploy } from "@ionic/cloud-angular";
import { Device } from 'ionic-native';
import { Observable } from "rxjs/Observable";
import { SettingsService } from '../../shared/services/SettingsService';
import { LogoutPage } from '../logout/logout';
import { StorageService } from '../../shared/services/storage.service';
import { ENV } from '../../shared/constant/env';
import { AnalyticsService } from '../../shared/services/analytics.service';
import {InvitePopoverPage} from "../invite-pop-over/invite-pop-over";
// import { DesktopComponent } from '../../desktop/desktop.component';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage implements AfterViewInit {

  public user: User;
  public newVersionAvailable: boolean = false;
  private checkingForNewVersion: boolean = true;
  private loadingController: Loading;
  private rootNavCtrl: NavController;
  private imageCacheCount: number = 0;
  private imageCacheBytes: number = 0;
  private imageQuality;
  private videoQuality;
  private appVersion = ENV.APP_VERSION;
  private device = Device;
  private readyToUpdate: boolean = false;
  private downloadProgress: number;
  private extractProgress: number;
  private downloadStarted: boolean = false;
  private updateStarted: boolean = false;

  constructor(public statusBar: StatusBar,
              public alertCtrl: AlertController,
              public _nav: NavController,
              public _navParams: NavParams,
              public _sessionService: SessionService,
              public _deploy: Deploy,
              public popoverCtrl: PopoverController,
              public platform: Platform,
              public _settingsService: SettingsService,
              private _localStorage: StorageService,
              private _loadingCtrl: LoadingController,
              private _app: App,
              private _analytics: AnalyticsService
  ) {
    // this.statusBar.backgroundColorByHexString(twzColor.orangeDarkHex);
    this.rootNavCtrl = _navParams.get('rootNavCtrl') || _nav;

    if (typeof this._sessionService.user !== 'undefined') {
      this.user = this._sessionService.user;
    } else {
      this._sessionService.userObservable.subscribe((res) => {
        this.user = res;
      });
    }

    this._localStorage.get('videoQuality').then((videoQuality) => {
      if (videoQuality == "Low" || videoQuality == "Medium" || videoQuality == "High") {
        this.videoQuality = videoQuality;
      } else {
        this.videoQuality = 'Low';
        this._localStorage.set('videoQuality', this.videoQuality);

      }
    });

    this._localStorage.get('imageQuality').then((imageQuality) => {
      if (imageQuality) {
        this.imageQuality = imageQuality;
      } else {
        this.imageQuality = 'Low';
        this._localStorage.set('imageQuality', 'Low');

      }
    });

  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }

  // goToDesktopComponent() {
  //   this._nav.setRoot(DesktopComponent);
  // }

  ngAfterViewInit() {
    this.checkForNewVersion().subscribe((newVersionAvailable)=> {
      this.newVersionAvailable = newVersionAvailable;
      this.checkingForNewVersion = false;
    });

    this._localStorage.countImageCache().subscribe((res) => {
      this.imageCacheBytes = res.totalBytes;
      this.imageCacheCount = res.count;
    });



  }
  showLoading(msg) {
    this.loadingController = this._loadingCtrl.create({
      content: msg
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
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

  // downloadProgressCallback(p:number) {
  //   this.downloadProgress = p;
  // }

  downloadNewAppVersion() {
    // this.showLoading('Updating the app');
    this.newVersionAvailable = false;
    this.downloadStarted = true;
    this._deploy.download({
      onProgress: p => {
        // toast.setMessage('Downloading .. ' + p + '%');
        this.downloadProgress = p;
        // console.log('Downloading = ' + p + '%');
      }
    }).then(() => {
      this.readyToUpdate = true;
      this.downloadProgress = null;
    }, (err) => {
      // this.hideLoading();
      this.downloadProgress = null;
      this.presentAlert('Update Download Error', JSON.stringify(err));
    });
  }

  // extractProgressCallback(p:number) {
  //   this.extractProgress = p;
  // }

  extractNewAppVersion() {
    this.updateStarted = true;
    this._deploy.extract({
      onProgress: p => {
        // toast.setMessage('Downloading .. ' + p + '%');
        this.extractProgress = p;
        // console.log('Extracting = ' + p + '%');
      }
    }).then((res) => {
      this.reloadApp();
    }, (err) => {
      // this.hideLoading();
      this.presentAlert('Update Extract Error', JSON.stringify(err));
    });
  }

  reloadApp() {
    // this.hideLoading();
    this._deploy.load();
  }

  logout() {
    let confirm = this.alertCtrl.create({
      title: 'Log Out?',
      message: 'Are you sure you want to log out of Tunaweza?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Log Out',
          handler: () => {
            // console.log('Agree clicked');
            this._app.getRootNav().setRoot(LogoutPage);
          }
        }
      ]
    });
    confirm.present();

  }

  imageQualityChange($event) {
    this._localStorage.set('imageQuality', $event);
  }
  videoQualityChange($event) {
    this._localStorage.set('videoQuality', $event);
  }
  clearImageCache() {
    this.showLoading('Clearing Cache');
    this._localStorage.clearImageCache().subscribe(() => {
      this._localStorage.countImageCache().subscribe((res) => {
        this.hideLoading();
        this.imageCacheBytes = res.totalBytes;
        this.imageCacheCount = res.count;
      });
    }, (err) => {
      this.hideLoading();
      this.presentAlert('Cache Clear Error', JSON.stringify(err));

    });

  }

  countImageCache() {
    this._localStorage.countImageCache().subscribe((res) => {
      this.imageCacheBytes = res.totalBytes;
      this.imageCacheCount = res.count;
    });

  }

  panright($event) {
    this.rootNavCtrl.pop();
  }

  restartAppAlert() {
    let confirm = this.alertCtrl.create({
      title: 'Setting Requires Restart',
      message: 'You must restart the app to see this setting.',
      buttons: [
        {
          text: 'Later',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Restart Now',
          handler: () => {
            // console.log('Agree clicked');
            window.location.reload();
          }
        }
      ]
    });
    confirm.present();
  }

  presentAlert(title='Alert', message='Some Alert') {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: title,
      buttons: ['OK']
    });
    alert.present();
  }

  presentInvitePopover() {
    let popover = this.popoverCtrl.create(InvitePopoverPage);
    popover.present();
  }



}
