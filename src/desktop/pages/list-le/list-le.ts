import { Component } from "@angular/core";
import { Response } from "@angular/http";
import { NavController, AlertController, ToastController, LoadingController, Loading, } from "ionic-angular";
import { LearningExperienceService } from "../../../shared/services/learning-experience.service";
import { SessionService } from "../../../shared/services/session.service";
import { ListLeModules } from "../list-le-modules/list-le-modules";
import { EditLe } from "../edit-le/edit-le";
import { StatusBar } from '@ionic-native/status-bar';
import {LearningExperience} from "../../../shared/models/LearningExperience";


@Component({
  selector: 'list-le',
  templateUrl: 'list-le.html'
})
export class ListLe {

  public leResponse: any;
  public refreshObject: any;
  public infiniteObject: any;
  public rawLes: LearningExperience[] = [];
  private loading: boolean= true;
  private loadingController: Loading;
  private showSort: boolean = false;
  private listOrdered: boolean = false;

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

    let params = {};
    if (typeof searchTerm !== 'undefined') {
      params['search'] = searchTerm;
    }

    this._leService.getList(params).subscribe((res) => {
      this.leResponse = res;
      this.rawLes.push(...res.results);
      this.loading = false;
      this.hideLoading();
    });
  }

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

  doInfinite($event) {
    this.infiniteObject = $event;
    if (typeof this._leService.listObject !== 'undefined' && this._leService.listObject.next) {
      // console.log('update requests');
      this._leService.getNextList().subscribe( (res) => {
        this.rawLes.push(...res.results);
        $event.complete();
      });
    } else if (typeof this._leService.listObject !== 'undefined' && !this._leService.listObject.next) {
      this.infiniteObject.complete();
      this.infiniteObject.enable(false);
    } else {
      this.infiniteObject.complete();
    }
  }

}
