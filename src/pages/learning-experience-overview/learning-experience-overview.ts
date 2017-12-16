import { Component, ViewChild, ElementRef } from '@angular/core';
import { Content, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { LearningExperience } from '../../shared/models/LearningExperience';
import { LearningExperienceModuleListPage } from '../learning-experience-module-list/learning-experience-module-list';
import { ReviewService } from '../../shared/services/review.service';
import { Review } from '../../shared/models/Review';
import { LEProgressService } from '../../shared/services/le-progress.service';
import { LearningExperienceService } from '../../shared/services/learning-experience.service';
import { Observable } from 'rxjs';
import { StorageService } from '../../shared/services/storage.service';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-learning-experience-overview',
  templateUrl: 'learning-experience-overview.html'
})
export class LearningExperienceOverviewPage {

  @ViewChild(Content)
  public contentView: Content;

  @ViewChild('content')
  public content: Content;

  @ViewChild('video')
  public video: ElementRef;

  public leModulesResponse: Response;
  public le: LearningExperience;
  public reviews: Review[];
  public tags: any[];
  private loading: boolean = true;
  private loadingReviews: boolean = true;
  private footerVisible: boolean = false;
  private headerBorder: boolean = false;
  private fullscreenMode: boolean = false;

  constructor(public statusBar: StatusBar,
              public _nav: NavController,
              public _navParams: NavParams,
              public _leService: LearningExperienceService,
              public _toastCtrl: ToastController,
              public _LEProgressService: LEProgressService,
              public _reviewService: ReviewService,
              private _localStorage: StorageService,
              private _platform: Platform,
              private _analytics: AnalyticsService) {

    // this.statusBar.backgroundColorByHexString(twzColor.orangeDarkHex);
    this.le = this._navParams.get('le');
    // console.log(this.le);

    // is a video
    if (this.le.vimeo) {
      // if (!this.le.is_started) {
      //   this.fullscreenMode = true;
      // }
      this.fullscreenMode = true;
      this.getUrlForVideo().subscribe((res) => {
        this.le.vimeo.src = res;
      });
    }

    this.getRecentReviews();
  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
    this._analytics.logEvent('learning-experience', 'navigated-to-le-overview', this.le.id + ':' + this.le.title);
  }

  showToast(msg, time=3000) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: time,
      position: 'top'
    });
    toast.present();
  }


  goToLe(le) {
    this._LEProgressService.post({
      course: le.id
    }).subscribe((res) => {
      this._leService.shouldRefresh.emit(true);
      this._nav.push(LearningExperienceModuleListPage, {
        le: le
      });
    });
  }

  goBack() {
    this._nav.pop();
  }

  pan($event: any) {
    if (this.contentView.getScrollElement().scrollTop <= 0) {
      if ($event.isFinal === true) {
        if ($event.additionalEvent === 'pandown') {
          setTimeout(() => {
            this.goBack();
          }, 1);
        }
      }
    }
  }

  starRating(star:number, rating:any=this.le.rating) {
    if (star < parseFloat(rating) + 1.00 && star > parseInt(rating)) {
      return "star-half"
    } else if (star <= parseInt(rating)) {
      return "star"
    } else {
      return "star-outline"
    }
  }

  getRecentReviews() {
    this.loadingReviews = true;
    this._reviewService.getList( {object_id: this.le.id} ).subscribe((res) => {
      this.reviews = res;
      this.reviews = this.reviews.reverse();
      this.loadingReviews = false;
    }, (err) => {
      this.loadingReviews = false;
    });
  }

  saveLe() {
    this.showToast('This feature will be implemented soon.');
  }

  getUrlForVideo() {
    return Observable.create((subscriber) => {

      let videoQuality = "Low";
      this._localStorage.get('videoQuality').then((videoQuality) => {
        if (videoQuality == "Low" || videoQuality == "Medium" || videoQuality =="High") {
          videoQuality = videoQuality;
        } else {
          videoQuality = "Low";
        }

        console.log(videoQuality);
        console.log(this.le);
        let videoQualities = [];
        let index = 0;
        for (let video of this.le.vimeo.download) {
          if (video.quality !== 'source') {  // we never want the source file, its too big!
            videoQualities.push({index:index, size: video.size, link: video.link});
          }
          index ++;
        }
        console.log('before sort', videoQualities);

        videoQualities.sort((a,b) => {
          return (a.size > b.size) ? 1 : ((b.size > a.size) ? -1 : 0);
        });

        console.log('after sort', videoQualities);

        //sort video qualites
        if (videoQuality == "High") {
          subscriber.next(videoQualities[videoQualities.length-1].link);
        } else if (videoQuality == "Medium" && videoQualities.length > 1) {
          subscriber.next(videoQualities[1].link);
        } else {
          subscriber.next(videoQualities[0].link);
        }
        subscriber.complete();

      });


      return () => {
        //
      };
    });

  }

  endedEvent($event) {
    console.log('video ended', $event);
    let shouldScroll = this.fullscreenMode;
    this.unSetVideoFullScreen();
    // console.log();
    if (shouldScroll) {
      this.contentView.scrollTo(0, this.video.nativeElement.scrollHeight, 300);
    }
  }

  playEvent($event) {
    console.log('play event', $event);
    this.setVideoFullScreen();
    this.contentView.scrollTo(0, 0, 100);

  }

  setVideoFullScreen() {
    // only go full screen if there is a video
    if (this.le.vimeo_id) {
      this.fullscreenMode = true;
      this.content.resize();
    }
  }

  unSetVideoFullScreen() {
    // this.opaqueHeader();
    // this.showFooter();
    this.fullscreenMode = false;
    this.content.resize();
    // this._platform.
  }

  scrollEvent($event) {
    // console.log('scrolling!',$event);
    if ($event) {
      if ($event.scrollTop > 20) {
        if (this.fullscreenMode) {
          this.unSetVideoFullScreen();
        }
      } else {
        if (!this.fullscreenMode) {
          this.setVideoFullScreen();
        }
      }
    }

  }


}
