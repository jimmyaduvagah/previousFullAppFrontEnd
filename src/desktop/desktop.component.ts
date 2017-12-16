// desktop.component.ts
import { Component, ViewChild } from '@angular/core';
import { MenuController, NavController, AlertController, App } from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { Post } from '../../shared/models/Post';
import { PostStore } from '../../shared/services/post.store';
import { FeedNewPostPage } from '../feed-new-post/feed-new-post';
import { twzColor } from '../../shared/utils/twz-color-util';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthTokenService } from '../shared/services/authtoken.service';
import { SessionService } from '../shared/services/session.service';
import { LogoutPage } from '../pages/logout/logout';
import { UserService } from '../shared/services/user.service';
import { LoginPage } from '../pages/login/login';
import { AddNewLe } from './pages/add-new-le/add-new-le';
import { MyApp } from '../app/app.component';
import { ListLe } from "./pages/list-le/list-le";
import { AddNewCategory } from "./pages/add-new-category/add-new-category";
import { ListLeCategories } from './pages/list-category/list-category';
import { AdminComponent, OnAdminAuthenticated } from "../shared/bases/components/admin.component";
import { MorePagesPage } from "../pages/more-pages/more-pages";
import { MainTabs } from "../pages/main-tabs/main-tabs";
import { DashboardLe } from "./pages/le-dashboard/dashboard-le";
import { addNewSurvey } from "./pages/add-new-survey/add-new-survey";
import { dashboardUserActivity } from "./pages/user-activity-dashboard/dashboard-user-activity";
import { listSurvey } from "./pages/list-survey/list-survey";
import { SubmissionCreatePage } from './pages/submission-create/submission-create';
import { SubmissionListPage } from './pages/submission-list/submission-list';
import { ENV } from '../shared/constant/env';
import { ProfilePage } from '../pages/profile/profile';
import { OnAuthenticated } from '../shared/bases/components/authenticated.component';




@Component({
  templateUrl: 'desktop.html'
})

export class DesktopComponent extends AdminComponent implements OnAdminAuthenticated, OnAuthenticated {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;
  desktopMode: boolean = ENV.DESKTOP_MODE;


  constructor(
    private menu: MenuController,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public _sessionService: SessionService ,
    public _nav: NavController,
    public _alertCtrl: AlertController,
    public _app: App,
    private _authToken: AuthTokenService,
    private _userService: UserService,

  ) {
    super (_nav , _sessionService ,_alertCtrl ,_app);
  }

  OnAuthenticated() {
    // TODO: This is just temporary to not force admin users for desktop...
    this.OnAdminAuthenticated();
  }

  OnAdminAuthenticated () {
    this.menu.enable(false, 'menu');

    if (this._sessionService.isLoggedIn()) {
      // this.rootPage = DashboardLe;
      // this.rootPage = ListLe;
      this.rootPage = SubmissionListPage;
    }
    // TODO: this admin check won't need to be here when we split to a different module.
    if (this._sessionService.user.userprofile.is_admin || this._sessionService.user.is_staff ) {
      this.pages = [
        {title: 'My Profile', component: ProfilePage},
        {title: 'L.E Dashboard', component: DesktopComponent},
        {title: 'Add New LE', component: AddNewLe},
        {title: 'Edit LEs', component: ListLe},
        {title: 'Add New Category', component: AddNewCategory},
        {title: 'List Category', component: ListLeCategories},
        {title: 'New LE Submission', component: SubmissionCreatePage},
        {title: 'LE Submissions', component: SubmissionListPage},

        // removed back since there is no need to have back with the tab menus
        {title: 'Logout', component: LogoutPage}
      ];
    } else {
      this.rootPage = SubmissionListPage;
      this.pages = [
        {title: 'My Profile', component: ProfilePage},
        {title: 'New LE Submission', component: SubmissionCreatePage},
        {title: 'LE Submissions', component: SubmissionListPage},

        // removed back since there is no need to have back with the tab menus
        {title: 'Logout', component: LogoutPage}
      ];

    }

  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  backtoApp() {
    this.menu.enable(false, 'lemenu');
    this._app.getRootNav().setRoot(MainTabs);
  }




}


