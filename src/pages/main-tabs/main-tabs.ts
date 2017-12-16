import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { User } from '../../shared/models/User';
import { FeedPage } from '../feed/feed';
import { LearningExperienceListPage } from '../learning-experience-list/learning-experience-list';
import { ProfilePage } from '../profile/profile';
import { ContactsPage } from '../contacts/contacts';
import { Platform, Content, Tabs, ViewController, NavParams } from 'ionic-angular';
import { MorePagesPage } from '../more-pages/more-pages';
import { AnalyticsService } from '../../shared/services/analytics.service';
// import { NotificationsPage } from '../notifications/notifications';

@Component({
  selector: 'main-tabs',
  templateUrl: 'main-tabs.html'
})
export class MainTabs {
  @ViewChild('mainTabs') tabRef: Tabs;
  public user: User;
  tabFeed = FeedPage;
  tabLearn = LearningExperienceListPage;
  tabProfile = ProfilePage;
  tabSettings = MorePagesPage;
  tabContacts = ContactsPage;
  // tabNotifications = NotificationsPage;
  indexToSelect: number = 0;

  constructor(
      // public statusBar: StatusBar,
      // public navCtrl: NavController,
      // public _sessionService: SessionService
      public navParams: NavParams,
      public _platform: Platform,
      public _analytics: AnalyticsService
  ) {
    this.indexToSelect = navParams.get('selectedTabIndex') || 0;
    this._analytics.setSelectedTab(this.indexToSelect);
  }

  ionViewDidLoad() {
  }

  tabSelected(tab) {
    this._analytics.setSelectedTab(tab.index);
  }

}
