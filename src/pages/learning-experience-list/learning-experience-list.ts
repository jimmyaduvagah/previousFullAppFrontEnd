import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Keyboard, NavController, NavParams, Searchbar } from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';
import { twzColor } from '../../shared/utils/twz-color-util';
import { LearningExperienceService } from '../../shared/services/learning-experience.service';
import { LearningExperienceModuleListPage } from '../learning-experience-module-list/learning-experience-module-list';
import { LearningExperienceOverviewPage } from '../learning-experience-overview/learning-experience-overview';
import { LearningExperience } from '../../shared/models/LearningExperience';
import { Subscription } from 'rxjs/Subscription';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-learning-experience-list',
  templateUrl: 'learning-experience-list.html'
})
export class LearningExperienceListPage implements OnDestroy {

  public leResponse: Response;
  public rawLes: LearningExperience[] = [];
  public les_started: LearningExperience[] = [];
  public les_completed: LearningExperience[] = [];
  public les_untouched: [{category: string, les: LearningExperience[]}];
  public leFilter: string;
  public refreshObject: any;
  public infiniteObject: any;

  private loading: boolean = true;
  private rootNavCtrl: NavController;
  private subscriptions: Subscription[] = [];

  constructor(public statusBar: StatusBar,
              public navParams: NavParams,
              public _nav: NavController,
              public _keyboard: Keyboard,
              public _leService: LearningExperienceService,
              public _sessionService: SessionService,
              private _analytics: AnalyticsService) {
    this.statusBar.backgroundColorByHexString(twzColor.blueDarkHex);
    this.rootNavCtrl = navParams.get('rootNavCtrl') || _nav;
    this.getLes();
    this.subscriptions.push(this._leService.shouldRefresh.subscribe((res) => {
      this.getLes();
    }));
  }

  ionViewWillEnter() {
    setTimeout(() => {
      if (this._analytics.getSelectedTab() === 1) {
        this._analytics.logScreenView(this.constructor.name);
      }
    }, 250);
  }

  processLes(les: LearningExperience[]) {
    // console.log('processing', les);
    if (typeof les !== "undefined") {
      let les_completed = [];
      let les_started = [];
      let les_untouched: [{category: string, les: LearningExperience[]}];
      for (let le of les) {
        if (le.is_completed) {
          les_completed.push(le);
        } else if (le.is_started) {
          les_started.push(le);
        } else {
          if (les_untouched) {
            let cat = les_untouched.find(cat => cat.category == le.category);
            if (cat) {
              cat.les.push(le);
            } else {
              les_untouched.push({category: le.category, les: [le]});
            }
          } else {
            les_untouched = [{category: le.category, les: [le]}];
          }
        }
      }
      this.les_untouched = les_untouched;
      les_untouched = undefined;
      if (this.les_completed.length !== les_completed.length) {
        this.les_completed = les_completed;
      }
      les_completed = undefined;
      if (this.les_started.length !== les_started.length) {
        this.les_started = les_started;
      }
      les_started = undefined;
      this.loading = false;
    }
  }

  getLes() {
    let params = {};
    if (typeof this.leFilter !== 'undefined' && this.leFilter) {
      params['search'] = this.leFilter;
    }
    this._leService.getList(params).subscribe((res) => {
      this.leResponse = res;
      this.rawLes = res.results;
      this.processLes(this.rawLes);
      if (this.refreshObject) {
        this.refreshObject.complete();
        if (this.infiniteObject) {
          this.infiniteObject.enable(true);
        }
      }
    });
  }

  doRefresh(refresher) {
    this.refreshObject = refresher;
    this.getLes();
  }

  doInfinite($event) {
    this.infiniteObject = $event;
    if (typeof this._leService.listObject !== 'undefined' && this._leService.listObject.next) {
      // console.log('update requests');
      this._leService.getNextList().subscribe( (res) => {
        this.rawLes.push(...res.results);
        this.processLes(this.rawLes);
        $event.complete();
      });
    } else if (typeof this._leService.listObject !== 'undefined' && !this._leService.listObject.next) {
      this.infiniteObject.complete();
      this.infiniteObject.enable(false);
    } else {
      this.infiniteObject.complete();
    }

  }

  filterLes($event) {
    if ($event.keyCode === 13) {
      this._keyboard.close();
    }
    if (typeof $event.target.value !== 'undefined') {
      if ($event.target.value.length > 0) {
        this.leFilter = $event.target.value;
        this.getLes();
        return true;
      }
    }
    this.leFilter = null;
    this.getLes();
    return false;
  }

  goToLe(le) {
    this.rootNavCtrl.push(LearningExperienceOverviewPage, {
      le: le
    }, {
      animation: 'md-transition'
    });
  }

  ngOnDestroy() {
    for(let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

}
