import { Component, OnInit } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Device } from 'ionic-native';
import { ENV } from '../../shared/constant/env';
import { BugService } from "../../shared/services/bug.service";
import { SessionService } from '../../shared/services/session.service';
import { UserService } from "../../shared/services/user.service";
import { NewBugReportPage } from "../bug-new-report/bug-new-report";
import { AnalyticsService } from '../../shared/services/analytics.service';



@Component({
  selector: 'page-bug-reporting',
  templateUrl: 'bug-reporting.html'
})

export class BugReportingPage {
  private loadingController: Loading;
  private error;
  private issues_title: string = "Open Issues";
  private loading_closed_issues:boolean = true;
  private loading_open_issues:boolean = true;
  private loading_my_issues:boolean = true;
  private closed_issues: any = [];
  private open_issues: any = [];
  private my_issues: any = [];
  private user_email:string = '';
  private user:any;
  private refresher;


  constructor(
              public _sessionService: SessionService,
              public _userService: UserService,
              private loadingCtrl: LoadingController,
              private _bugService: BugService,
              private _toastCtrl: ToastController,
              private _nav: NavController,
              private _analytics: AnalyticsService,
  )
  {
        this._userService.getCurrentUser().subscribe((res) => {
          this.user_email = res.email;
          this.user = res;
          console.log(this.user_email);
          this.loadMyIssues(res);
          this.loadOpenIssues(res);
          this.loadClosedIssues(res);
      });

  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }


  showLoading(message) {
    this.loadingController = this.loadingCtrl.create({
      content: message
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
  doRefresh($event)
  {
    this.refresher = $event;
    if (this.issues_title == "Open Issues") {
       this.loadOpenIssues(this.user);
    } else if ( this.issues_title == "Closed Issues") {
       this.loadClosedIssues(this.user);
    } else if ( this.issues_title == "My Issues") {
        this.loadMyIssues(this.user);
    } else {
      $event.complete();
      this.refresher = null;
    }
  }
  createBug() {
    this._nav.push(NewBugReportPage);
  }
  loadOpenIssues(user) {
    this._bugService.getList({}).subscribe((res) => {
      this.open_issues = res;
      console.log(this.open_issues);
      this.loading_open_issues = false;
      let my_json = JSON.stringify(this.open_issues);
      let user_email = ''+user.email;
      let index = user_email.indexOf('@');
      let name = user_email.substr(0,index);
      let filtered_json = JSON.parse(my_json).filter(function (entry) {
            return entry.author.username === 'twzbugreporter'|| entry.author.username.includes(name);
      });
      this.open_issues = filtered_json;
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }

    },(error) => {
      this.showToast('error loading issues please refresh');
      this.loading_open_issues = false;
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }

      console.log(error);
    })

  }
  loadClosedIssues(user) {
    this._bugService.getClosedIssues({}).subscribe((res) => {
      this.closed_issues = res;
      console.log(this.closed_issues);
      let my_json = JSON.stringify(this.closed_issues);
      let user_email = ''+user.email;
      let index = user_email.indexOf('@');
      let name = user_email.substr(0,index);
      let filtered_json = JSON.parse(my_json).filter(function (entry) {
            return entry.author.username === 'twzbugreporter' || entry.author.username.includes(name);
      });
      this.closed_issues = filtered_json;
      this.loading_closed_issues = false;
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }

    },(error) => {
      this.showToast('error loading issues please refresh');
       this.loading_closed_issues = false;
       if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }

      console.log(error);
    })

  }
  loadMyIssues(user) {
   this._bugService.getAllIssues({}).subscribe((res) => {
     this.my_issues = res;
      let my_json = JSON.stringify(this.my_issues)
      let user_email = ''+user.email;
      let index = user_email.indexOf('@');
      let name = user_email.substr(0,index);

      let filtered_json = JSON.parse(my_json).filter(function (entry) {
         if(entry.description !== null) {
            return entry.description.includes(user.email) || entry.author.username.includes(name)
         } else {
            return entry.author.username.includes(name)
         }
      });
      console.log(this.my_issues);

      this.my_issues = filtered_json;
      this.loading_my_issues = false;
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }

    },(error) => {
      this.showToast('error loading issues please refresh');
       this.loading_my_issues = false;
       if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }

      console.log(error);
    })
  }

}
