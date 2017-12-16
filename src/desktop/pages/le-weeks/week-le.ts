import { Component, OnInit } from "@angular/core";
import { NavController, AlertController, ToastController, LoadingController, Loading, NavParams, } from "ionic-angular";
import { LearningExperienceService } from "../../../shared/services/learning-experience.service";
import { SessionService } from "../../../shared/services/session.service";
import { ListLeModules } from "../list-le-modules/list-le-modules";
import { EditLe } from "../edit-le/edit-le";
import { StatusBar } from '@ionic-native/status-bar';
import * as _ from 'underscore';
import * as moment from 'moment';




@Component({
  selector: 'week-le',
  templateUrl: 'week-le.html'
})
export class LeWeek  implements  OnInit{
  private week_results: any;
  private le_list: any;
  private week: any = [];
  private loadingController: Loading;


  constructor(
    public statusBar: StatusBar,
    private _nav: NavController,
    private _navParams: NavParams,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public _leService: LearningExperienceService,
    public _sessionService: SessionService,
  )
  {
    this.week = this._navParams.get('week');
    this.le_list = this._navParams.get('le_list').results;
  }

  ngOnInit() {
      this.filterWeek(this.week , this.le_list);
  }

  filterWeek(week , le_list) {
    let dates = {};
    _.each(week[1], function (bb) { dates[new Date (bb).toString().slice(0, 10)] = true; });

    this.week_results = _.filter(le_list, function (le) {
        return dates[new Date (le.created_on).toString().slice(0, 10)];
    }, week)
  }

  showLoading(){
    this.loadingController = this.loadingCtrl.create({
      content: `Loading..`
    });
    this.loadingController.present();
  }

  hideLoading(){
    this.loadingController.dismiss();
  }


  goToLe(le) {
    this._nav.push(ListLeModules, {
      le: le
    });
  }

  goToEditLe(le) {
    this._nav.push(EditLe, {
      le: le
    });
  }



}
