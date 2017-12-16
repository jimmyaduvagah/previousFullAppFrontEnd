import { Component } from '@angular/core';
import { App, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { NotificationService } from '../../shared/services/notification.service';
import { Notification } from '../../shared/models/Notification';
import { PostDetailPage } from '../post-detail/post-detail';
import { StatusBar } from '@ionic-native/status-bar';
import { twzColor } from '../../shared/utils/twz-color-util';
import { PUSH_NOTIFICATION_TYPES } from '../../shared/constant/push-notification-types';
import { ContactsPage } from '../contacts/contacts';
import { ProfilePage } from '../profile/profile';
import { NotificaionRoutingService } from '../../shared/services/notification-routing.service';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  notifications: Notification[];
  private loadingController: Loading;
  private loading: boolean = true;
  private refresher;

  constructor(
    private _navCtrl: NavController,
    private _notifications: NotificationService,
    private _loadingCtrl: LoadingController,
    private _notificationRouting: NotificaionRoutingService,
    private _navParams: NavParams,
    private _app: App,
    private _analytics: AnalyticsService
  ) {
    this.showLoading();
  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }

  showLoading(msg='Loading Notifications') {
   this.loading = true;
  }

  hideLoading() {
    this.loading = false;
  }


  ionViewDidLoad() {
    this.getNotifications();
    // console.log('ionViewDidLoad NotificationsPage');
  }

  getNotifications() {
    this._notifications.getList({
      is_seen: false
    }).subscribe((res) => {
      this.notifications = res.results;
      this.hideLoading();
    });
  }

  goToPost(details:{postId: string}) {
    this._navCtrl.push(PostDetailPage, details);
  }

  notificationTap(notification, index) {
    this._notifications.markAsSeen(notification.id).subscribe((res) => {
      if (typeof index !== 'undefined') {
        this.notifications.splice(index, 1);
      }
    });
    this._notificationRouting.routeTo(notification);
  }

  doRefresh($event){
    // console.log($event, this.contact);
    this.refresher = $event;
    this._notifications.getList({
      is_seen: false
    }).subscribe((res) => {
      this.notifications = res.results;
      $event.complete();
      this.refresher = null;
    });
  }

}
