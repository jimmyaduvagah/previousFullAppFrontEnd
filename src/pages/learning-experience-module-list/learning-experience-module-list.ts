import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams, ModalController, LoadingController, Loading } from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';
import { twzColor } from '../../shared/utils/twz-color-util';
import { LearningExperienceService } from '../../shared/services/learning-experience.service';
import { LearningExpereienceModuleService } from '../../shared/services/course-module.service';
import { LearningExperience } from '../../shared/models/LearningExperience';
import { LearningExperienceModulePage } from '../learning-experience-module/learning-experience-module';
import { LearningExperienceRatingPage } from '../learning-experience-rating/learning-experience-rating';
import { LearningExperienceModule } from '../../shared/models/LearningExperienceModule';
import { LEProgressService } from '../../shared/services/le-progress.service';
import { LearningExperienceSectionCommentsPage } from '../learning-experience-section-comments/learning-experience-section-comments';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-learning-experience-module-list',
  templateUrl: 'learning-experience-module-list.html'
})
export class LearningExperienceModuleListPage {

  @ViewChild(Content)
  public contentView: Content;

  public leModulesResponse: Response;
  public leModules: LearningExperienceModule[];
  public le: LearningExperience;
  private loading: boolean = true;
  private loadingController: Loading;
  private leModuleId: string;

  constructor(public statusBar: StatusBar,
              public _nav: NavController,
              public _navParams: NavParams,
              public modalCtrl: ModalController,
              public _leService: LearningExperienceService,
              public _leModuleService: LearningExpereienceModuleService,
              public _LEProgressService: LEProgressService,
              public _sessionService: SessionService,
              private _loadingCtrl: LoadingController,
              private _analytics: AnalyticsService
  ) {

    // this.statusBar.backgroundColorByHexString(twzColor.orangeDarkHex);
    this.le = this._navParams.get('le');
    this.getLeModules();
  }

  ionViewDidEnter() {
    this._analytics.logEvent('learning-experience', 'navigated-to-le-module-list', this.le.id + ':' + this.le.title);
    this._analytics.logScreenView(this.constructor.name);
  }
  showLoading() {
    this.loadingController = this._loadingCtrl.create({
      content: `Loading Module`
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
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
      this.leModules = res.results;
      if (this._LEProgressService.singleObject.current_course_module) {
        if (this._LEProgressService.singleObject.completed !== true) {
          for (let leModule of this.leModules) {
            if (leModule.id === this._LEProgressService.singleObject.current_course_module) {
              this.goToLeModule(leModule);
            }
          }
        }
      }
      this.loading = false;
      this.hideLoading();
    }, (err) => {
      this.hideLoading();
    });
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

  goToNextModule(previousModuleId:string) {
    let currentModuleFound = false;
    for (let module of this.leModules) {
      if (currentModuleFound) {
        this.goToLeModule(module);
        return false;
      } else {
        if (previousModuleId == module.id) {
          currentModuleFound = true;
        }
      }
    }
    // if we didn't find any next LE to go to, lets rate it.
    this.showLoading();
    this._LEProgressService.singleObject.completed = true;
    this._LEProgressService.singleObject.end = true;
    this._LEProgressService.put(
      this._LEProgressService.singleObject.id,
      JSON.stringify(this._LEProgressService.singleObject)
    ).subscribe((res) => {
      this.hideLoading();
      this.goToRating();
    });
    return false;

  }

  goToLeModule(leModule) {
    this.leModuleId = leModule.id;
    this._nav.push(LearningExperienceModulePage, {
      leModuleId: leModule.id,
      le: this.le,
      callback: this.myCallbackFunction
    });

    // let moduleModal = this.modalCtrl.create(LearningExperienceModulePage, {
    //   leModuleId: leModule.id,
    //   le: this.le
    // });
    // moduleModal.onDidDismiss(data => {
    //   console.log(data);
    //   if (data) {
    //     if (data.action == "next") {
    //       this.goToNextModule(leModule.id);
    //     } else if (data.action == 'goToComment' && typeof data.section != 'undefined'){
    //       this._nav.push(LearningExperienceSectionCommentsPage, {section:data.section});
    //     }
    //   }
    //
    // });
    // moduleModal.present();

  }

  myCallbackFunction = (_params) => {
    return new Promise((resolve, reject) => {
      console.log(_params);
      console.log(this.leModuleId);
      if (_params) {
        if (_params.action == "next") {
          setTimeout(() => {
            this.goToNextModule(this.leModuleId);
              }, 100
          );

        }
        // else if (_params.action == 'goToComment' && typeof _params.section != 'undefined'){
        //   this._nav.push(LearningExperienceSectionCommentsPage, {section:_params.section});
        // }
      }
      resolve();
    });
  };

  goBack() {
    this._nav.pop({
      animation: 'md-transition',
    });
  }
  pan($event: any) {
    if (this.contentView.getScrollElement().scrollTop <= 0) {
      if ($event.isFinal === true) {
        if ($event.additionalEvent === 'pandown') {
          setTimeout(() => {
            this.goBack();
          }, 1);
          return;
        }
      }
    }
  }

  goToRating() {
    this._nav.setRoot(LearningExperienceRatingPage, {'le': this.le});
  }

}
