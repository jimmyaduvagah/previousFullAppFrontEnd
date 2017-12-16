import { Component } from "@angular/core";
import { NavController, AlertController, ToastController, LoadingController, Loading, } from "ionic-angular";
import { LearningExperienceService } from "../../../shared/services/learning-experience.service";
import { SessionService } from "../../../shared/services/session.service";
import { ListLeModules } from "../list-le-modules/list-le-modules";
import { EditLe } from "../edit-le/edit-le";
import { StatusBar } from '@ionic-native/status-bar';
import * as _ from 'underscore';
import * as moment from 'moment';
import { LeWeek } from "../le-weeks/week-le";




@Component({
  selector: 'dashboard-le',
  templateUrl: 'dashboard-le.html'
})
export class DashboardLe {


  public leResponse: any;
  private loading: boolean= true;
  private loadingController: Loading;
  private showSort: boolean = false;
  private listOrdered: boolean = false;
  private pubDates: any = [];
  private pubDatesWeek: any = [];
  private pubDatesDay: any = [];


  constructor(
    public statusBar: StatusBar,
    public _nav: NavController,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public _leService: LearningExperienceService,
    public _sessionService: SessionService,
  )
  {
    this.getLes();
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

  activateSort() {
    this.showSort = true;
  }

  deactivateSort() {
    this.showSort = false
    if(this.listOrdered) {
      console.log('list ordered');
      this.updateOrder();
    }
  }

  reorderItems(indexes) {
    let element = this.leResponse.results[indexes.from];
    this.leResponse.results.splice(indexes.from, 1);
    this.leResponse.results.splice(indexes.to, 0, element);
    console.log(indexes);
    this.listOrdered = true;
  }

  updateOrder() {
    let les: any = [];

    for(var o = 0 ; o < this.leResponse.results.length;o++) {
        les.push({'id':this.leResponse.results[o].id, 'order':o});
    }
    this._leService.put('reorder', JSON.stringify(les))
            .subscribe((res)=>{
                 let toast = this._toastCtrl.create({
                  message: 'updated le order',
                  duration: 1500
                });
                toast.present();
            console.log(res);
            },
            (errorMsg) => {
               console.log(errorMsg);
            });
  }

  getLes(searchTerm:any=undefined) {
    this.showLoading();

    let params = {'limit':5000};
    if (typeof searchTerm !== 'undefined') {
      params['search'] = searchTerm;
    }

    this._leService.getList(params).subscribe((res) => {
      this.leResponse = res;
      this.getpubDates();
      this.loading = false;
      this.hideLoading();
    });
  }
  weekLes(week) {
    this._nav.push(LeWeek ,{
      'week': week,
      'le_list': this.leResponse
    })
  }
  converttoString( str ){
    return str.toString().substr(0,15);
  }
  getSundayinWeek(num) {
    return moment().day("Sunday").week(num).toString().substr(0,15);
  }

  getSatinWeek(num) {
    return moment().day("Saturday").week(num).toString().substr(0,15);
  }
  groupDays() {
    this.pubDatesDay = _.groupBy(this.pubDates, function(date){
      if( moment(date).isoWeek() === moment().isoWeek()){
          return date;
      }
    });
     let obj = this.pubDatesDay;
     this.pubDatesDay = Object.keys(obj).map(function(e) {
        return [Number(e), obj[e]];
      });
  }
  groupweek(){
     this.pubDatesWeek = _.groupBy(this.pubDates, function(date){ return moment(date).isoWeek(); });
     let obj = this.pubDatesWeek;
     this.pubDatesWeek = Object.keys(obj).map(function(e) {
        return [Number(e), obj[e]];
      });
  }
  getpubDates() {

     for (let l = 0; l < this.leResponse.results.length; l++) {
       if (typeof (this.pubDates) !== 'undefined') {

         let str_index = this.leResponse.results[l].created_on.indexOf('T');
         let created_on : string = this.leResponse.results[l].created_on.substr(0, str_index);
         this.pubDates.push( new Date (created_on));

       } else {

         let str_index = this.leResponse.results[l].created_on.indexOf('T');
         let created_on : string = this.leResponse.results[l].created_on.substr(0, str_index);
         this.pubDates = new Date(created_on);
       }
     }
       this.pubDates.sort(this.date_sort_asc);
       this.groupweek();
       this.groupDays();

       console.log(this.pubDatesDay);
       console.log(this.pubDatesWeek);
  }
  date_sort_asc = function (date1, date2) {
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
  };

  deleteLe(le_id) {
        this.loading = true;
        let alert = this._alertCtrl.create({
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete this LE?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
                this.loading = false;

              }
            },
            {
              text: 'Delete',
              handler: () => {
                    this._leService.delete(le_id).subscribe((res) => {
                    let toast = this._toastCtrl.create({
                      message: 'Deleted LE '+le_id,
                      duration: 1500
                    });
                    toast.present();
                    this.getLes();
                    this.loading = false;
                    });
              }
            }
          ]
        });
        alert.present();
        return false;
  }

  filterLes($event) {
  if (typeof $event.target.value !== 'undefined') {
    if ($event.target.value.length > 0) {
      this.getLes($event.target.value);
      return true;
    }
  }
  this.getLes();
  return false;
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
