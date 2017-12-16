import {Component} from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { LearningExperienceService } from '../../../shared/services/learning-experience.service';
import { LearningExpereienceModuleService } from '../../../shared/services/course-module.service';
import { SessionService } from '../../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';
import { LearningExperience } from '../../../shared/models/LearningExperience';
import { NewLeModule } from '../new-le-module/new-le-module';
import { ListModuleSections } from "../list-module-sections/list-module-sections";
import { EditLeModule } from '../edit-le-module/edit-le-module';



@Component({
  selector: 'list-le-modules',
  templateUrl: 'list-le-modules.html'
})
export class ListLeModules {
  public leModulesResponse: any;
  public le: LearningExperience;
  private loading: boolean = true;
  private loadingController: Loading;
  private showSort: boolean = false;
  private listOrdered: boolean = false;


  constructor(
    public statusBar: StatusBar,
    public _nav: NavController,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    public _navParams: NavParams,
    private loadingCtrl: LoadingController,
    public _leService: LearningExperienceService,
    public _leModuleService: LearningExpereienceModuleService,
    public _sessionService: SessionService

  )
  {
    this.le = this._navParams.get('le');
    this.getLeModules();
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
    let element = this.leModulesResponse.results[indexes.from];
    this.leModulesResponse.results.splice(indexes.from, 1);
    this.leModulesResponse.results.splice(indexes.to, 0, element);
    console.log(indexes);
    this.listOrdered = true;
  }

  updateOrder() {
    let modules: any = [];
    for(var o = 0 ; o < this.leModulesResponse.results.length;o++ ) {
      modules.push({'id':this.leModulesResponse.results[o].id , 'order':o});
    }
    this._leModuleService.put('reorder', JSON.stringify(modules))
            .subscribe((res)=>{
            let toast = this._toastCtrl.create({
              message: 'updated le modules order',
              duration: 1500
            });
            toast.present();
            console.log(res);
            },
            (errorMsg) => {
               console.log(errorMsg);
            });
  }

  getLeModules(searchTerm:any=undefined) {
    this.showLoading();
    let params = {
      course: this.le.id
    };
    if (typeof searchTerm !== 'undefined') {
      params['search'] = searchTerm;
    }
    this._leModuleService.getList(params).subscribe((res) => {
      this.leModulesResponse = res;
      this.loading = false;
      this.hideLoading();
    });
  }

  deleteLeModule(module_id) {
        this.loading = true;
        let alert = this._alertCtrl.create({
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete this Module?',
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
                    this._leModuleService.delete(module_id).subscribe((res) => {
                    let toast = this._toastCtrl.create({
                      message: 'Deleted Module '+module_id,
                      duration: 1500
                    });
                    toast.present();
                    this.getLeModules();
                    this.loading = false;
                    });
              }
            }
          ]
        });
        alert.present();
        return false;
  }
  addNewModule() {
     this._nav.push(NewLeModule, {leid: this.le.id , le: this.le});
  }

  filterLes($event) {
    if (typeof $event.target.value !== 'undefined') {
      if ($event.target.value.length > 0) {
        this.getLeModules($event.target.value);
        return true;
      }
    }
    this.getLeModules(undefined);
    return false;
  }

  goToSection(module) {
    this._nav.push(ListModuleSections, {
      leid: this.le.id , le: this.le,
      module_id: module.id,
      module: module,
    });
  }

    goToEditModule(module) {
    this._nav.push(EditLeModule, {
      leid: this.le.id , le: this.le,
      module_id: module.id,
      module: module,

    });
  }





}
