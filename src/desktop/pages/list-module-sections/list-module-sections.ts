import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, Loading, LoadingController } from 'ionic-angular';
import { CourseModuleSectionsService } from '../../../shared/services/course-module-sections.service';
import { SessionService } from '../../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';
import { LearningExperienceModule } from "../../../shared/models/LearningExperienceModule";
import { NewModuleSection } from "../new-module-section/new-module-section";
import { EditModuleSections } from "../edit-module-section/edit-module-section";
import {
  SectionText,
  SectionGallery,
  SectionImage,
  SectionVideo
} from '../../../shared/models/LearningExperienceSections';



@Component({
  selector: 'list-module-sections',
  templateUrl: 'list-module-sections.html'
})
export class ListModuleSections {
  public moduleSections: any =[];
  public module: LearningExperienceModule;
  private loading: boolean = true;
  private module_id: string;
  private sectionTypesResponse: any =[];
  private le: any;
  private leid: any;
  private section_id: any;
  private section: any;
  public _sectionText: SectionText ;
  public _sectionGallery: SectionGallery ;
  public _sectionImage: SectionImage ;
  public _sectionVideo: SectionVideo ;
  private loadingController: Loading;
  private showSort: boolean = false;
  private listOrdered: boolean = false;


  constructor(
    public statusBar: StatusBar,
    public _nav: NavController,
    public _navParams: NavParams,
    private _alertCtrl: AlertController,
    private _toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public _moduleSectionsService: CourseModuleSectionsService,
    public _sessionService: SessionService

  )
  {
    this.module = this._navParams.get('module');
    this.module_id = this._navParams.get('module_id');
    this.leid = this._navParams.get('leid');
    this.le = this._navParams.get('le');
    this._sectionGallery = this._navParams.get('_sectionGallery');
    this._sectionImage = this._navParams.get('_sectionImage');
    this._sectionText = this._navParams.get('_sectionText');
    this._sectionVideo = this._navParams.get('_sectionVideo');
    this.getSectionTypes();
    this.getLeModulesSections();
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
  updateOrder() {
    let sections: any =  [];
    for(var o = 0 ; o < this.moduleSections.length; o++) {
        sections.push({'id':this.moduleSections[o].id , 'order':o});
    }
    this._moduleSectionsService.put('reorder', JSON.stringify(sections))
            .subscribe((res)=>{
            console.log(res);
              let toast = this._toastCtrl.create({
                message: 'updated le module sections order',
                duration: 1500
              });
              toast.present();

            },
            (errorMsg) => {
               console.log(errorMsg);
            });
  }

  reorderItems(indexes) {
    let element = this.moduleSections[indexes.from];
    this.moduleSections.splice(indexes.from, 1);
    this.moduleSections.splice(indexes.to, 0, element);
    console.log(indexes);
    this.listOrdered = true;
  }

  getSectionTitle(id) {
    let sectionArray = this.sectionTypesResponse;
     var i=0, len= sectionArray.length;
        for (; i<len; i++) {
            if (sectionArray[i].id === id) {
                return sectionArray[i].type;
            }
        }
     return "unknown";
  }
  getSectionTypes() {
    this.showLoading();
    this.loading = true;
    this._moduleSectionsService.getSectionTypes().subscribe((res) => {
      this.sectionTypesResponse = res;
    });
  }
  getLeModulesSections() {
    this._moduleSectionsService.getFullList(this.module_id).subscribe((res) => {
      this.moduleSections = res.results;
      this.loading = false;
      this.hideLoading();
    });
  }

  deleteModuleSection (section_id) {
        this.loading = true;
        let alert = this._alertCtrl.create({
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete this Module Section ?',
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
                    this._moduleSectionsService.delete(section_id).subscribe((res) => {
                    let toast = this._toastCtrl.create({
                      message: 'Deleted Module Section'+section_id,
                      duration: 1500
                    });
                    toast.present();
                    this.getLeModulesSections();
                    this.loading = false;
                    });
              }
            }
          ]
        });
        alert.present();
        return false;
  }

  goToEditModuleSection(moduleSection, section_id) {
    console.log({
      leid: this.le.id,
      le: this.le,
      module_id :this.module.id,
      module: this.module,
      moduleSection: moduleSection,
      section_id: section_id,
    });
      this._nav.push(EditModuleSections, {
        leid: this.le.id,
        le: this.le,
        module_id :this.module.id,
        module: this.module,
        moduleSection: moduleSection,
        section_id: section_id,
    });


  }

  addNewModuleSection() {
     this._nav.push(NewModuleSection, {le:this.le, leid:this.leid, module: this.module,module_id: this.module.id});
  }


  doInfinite($event) {
    if (typeof this._moduleSectionsService.listObject !== "undefined" && this._moduleSectionsService.listObject.next) {
      this._moduleSectionsService.getNextList().subscribe((res) => {
        this.moduleSections.push(...res.results);
        $event.complete();
      });
    } else {
      $event.complete();
    }
  }



}
