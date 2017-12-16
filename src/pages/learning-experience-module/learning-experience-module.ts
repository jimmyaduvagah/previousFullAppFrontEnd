import {
  AfterViewInit, Component, OnDestroy, ViewChild, ViewChildren, QueryList,
  ViewContainerRef
} from '@angular/core';
import {
  Content,
  Loading, LoadingController, ModalController, NavController, NavParams, Platform, Slides,
  ToastController, ViewController
} from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';
import { LearningExperienceService } from '../../shared/services/learning-experience.service';
import { LearningExpereienceModuleService } from '../../shared/services/course-module.service';
import { LearningExperience } from '../../shared/models/LearningExperience';
import { LearningExperienceModule } from '../../shared/models/LearningExperienceModule';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LearningExperienceSectionCommentsPage } from '../learning-experience-section-comments/learning-experience-section-comments';
import { StorageService } from '../../shared/services/storage.service';
import { LearningExperienceSectionComponent } from '../../blocks/learning-experience-section/learning-experience-section';
import { LEProgressService } from '../../shared/services/le-progress.service';
import { AnalyticsService } from '../../shared/services/analytics.service';



@Component({
  selector: 'page-learning-experience-module',
  templateUrl: 'learning-experience-module.html',
  animations: [
    trigger('mainImage', [
      state('yes', style({
        opacity: '1'
      })),
      state('no', style({
        opacity: '0'
      })),
      transition('no => yes', animate('500ms ease-in')),
      transition('yes => no', animate('500ms ease-in'))
    ])
  ]
})
export class LearningExperienceModulePage implements OnDestroy, AfterViewInit {

  @ViewChild(Content)
  public contentView: Content;

  // similar to the answer here: https://stackoverflow.com/questions/39366981/angular-2-viewchild-in-ngif
  // https://stackoverflow.com/a/41095677/1178940
  private slides: QueryList<LearningExperienceSectionComponent>;
  @ViewChildren(LearningExperienceSectionComponent) set content(content: QueryList<LearningExperienceSectionComponent>) {
    this.slides = content;
  }

  public mainImageShowing: string = 'yes';
  public leModulesResponse: Response;
  public le: LearningExperience;
  public leModuleId: string;
  public leModule: LearningExperienceModule;
  private loading: boolean = true;
  private loadingController: Loading;
  private currentSectionIndex: number = 0;
  private sectionsCount: number = 0;
  private sectionIds: string[] = [];
  private hideFab: boolean = false;
  private windowListenerFunction;
  private slideDeltaX: number = 0;
  private slideDeltaY: number = 0;
  private slideDeltaXHidden: number = 0;
  private sliding: boolean = false;
  private slideStartX: number = -1;
  private slideStartY: number = -1;
  private slideStartScrollY: number = 1;
  private slideInitialDirection: number = 0;
  private slideStartTime;
  private slideTrigger;
  // private parentModal;
  private parentElement;
  private sideSwipeTrigger = 100;
  private contentNativeElement;
  private previousPageElement;
  private moduleListCallback;

  constructor(public statusBar: StatusBar,
              public _nav: NavController,
              public _navParams: NavParams,
              public _leService: LearningExperienceService,
              public _toast: ToastController,
              public _leModuleService: LearningExpereienceModuleService,
              public _sessionService: SessionService,
              public _toastCtrl: ToastController,
              public _LEProgressService: LEProgressService,
              private _loadingCtrl: LoadingController,
              private _viewController: ViewController,
              private _storage: StorageService,
              private _platform: Platform,
              private _modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private _analytics: AnalyticsService
  ) {
    this.slideTrigger = this._platform.width() / 8;
    this.sideSwipeTrigger = this._platform.width() / 3;
    this.statusBar.hide();
    // this.statusBar.isVisible = false;
    // this.statusBar.overlaysWebView(true);
    this.windowListenerFunction = ()=>{
      this.statusBar.hide();
      // this.statusBar.isVisible = false;
      // this.statusBar.overlaysWebView(true);
    };
    document.addEventListener('resume',this.windowListenerFunction);
    setTimeout(() => {
      this.statusBar.hide();
      // this.statusBar.isVisible = false;
      // this.statusBar.overlaysWebView(true);
    }, 100);
    this.showLoading();
    // this.statusBar.backgroundColorByHexString(twzColor.orangeDarkHex);
    this.le = this._navParams.get('le');
    this.leModuleId = this._navParams.get('leModuleId');
    this.moduleListCallback = this._navParams.get('callback');
    this.getLeModule();

  }

  private ticker;
  private timer = 0;

  ionViewDidEnter() {
    if (!this._LEProgressService.singleObject.is_completed) {
      this.ticker = setInterval(() => {
        this.timer +=1;
      }, 1000);
    }
    this._analytics.logScreenView(this.constructor.name);

  }

  ionViewWillLeave() {
    if (this.ticker) {
      clearInterval(this.ticker);
      this._LEProgressService.singleObject.total_time_viewing += this.timer;
      this._LEProgressService.patch(this._LEProgressService.singleObject.id, {
        total_time_viewing: this._LEProgressService.singleObject.total_time_viewing
      }).subscribe(()=>{});
      this.ticker = undefined;
      this._analytics.logEvent('learning-experience', 'left-le-module', this.leModuleId + ':' + this.leModule.title, this.timer);
    }
  }

  ngAfterViewInit() {
    // this.setupSlides();
      this.contentNativeElement = this.contentView._elementRef.nativeElement;
      this.parentElement = this.contentView._elementRef.nativeElement.parentElement;

      this.previousPageElement = this.contentView._elementRef.nativeElement.parentElement.previousElementSibling;


  }

  // setupSlides() {
  //   let sliderSetupTimer = setInterval(() => {
  //     if (typeof this.slides !== 'undefined') {
  //       clearInterval(sliderSetupTimer);
  //       sliderSetupTimer = undefined;
  //       console.log(this.slides);
  //       this.setupLocking(this.currentSectionIndex);
  //     }
  //   }, 100);
  //
  // }
  private activeBottomToast;
  presentToast(message:string) {
    if (typeof this.activeBottomToast === 'undefined') {
      this.activeBottomToast = this.toastCtrl.create({
        message:  message,
        duration: 3000,
        position: 'bottom'
      });

      this.activeBottomToast.onDidDismiss(() => {
        this.activeBottomToast = undefined;
      });

      this.activeBottomToast.present();
    }
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

  showToast(msg, time=3000) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: time,
      position: 'top'
    });
    toast.present();
  }

  private commentsModal;
  showComments() {
    // if (typeof this.commentsModal === 'undefined') {
    //   this.commentsModal = this._modalCtrl.create(LearningExperienceSectionCommentsPage, { section: this.leModule.sections[this.currentSectionIndex] });
    //   this.commentsModal.onDidDismiss(data => {
    //     this.commentsModal = undefined;
    //   });
    //   this.commentsModal.present();
    // }
    this._nav.push(LearningExperienceSectionCommentsPage, {
      section: this.leModule.sections[this.currentSectionIndex]
    }, {
      animation: 'md-transition'
    });
    // this.goBack({action:'goToComment', section: this.leModule.sections[this.currentSectionIndex]})
  }

  getLeModule() {
    let params = {};

    this._leModuleService.get(this.leModuleId, params).subscribe((res) => {
      this.leModule = res;
      this.leModule.sections.push({
        type: 'end_of_module',
        moduleTitle: this.leModule.title
      });


      this.sectionsCount = this.leModule.sections.length;

      for (let section of this.leModule.sections) {
        this.sectionIds.push(section.id);
        // this.slides.push(section);
      }
      this.sectionIds.push("lastSection");

      for ( let section in this.leModule.sections) {
        if (this.leModule.sections.hasOwnProperty(section)) {
          if (this.leModule.sections[section].section_id === this._LEProgressService.singleObject.current_course_module_section) {
            this.currentSectionIndex = parseInt(section);
            break;
          }
        }
      }
      this.saveProgress();
      this.hideLoading();
      this._analytics.logEvent('learning-experience', 'navigated-to-le-module', this.leModuleId + ':' + this.leModule.title);
      //get rid of the "hidden" attribute on the previous page so when we slide down, you see that page.
      this.previousPageElement.removeAttribute('hidden');
      this.loading = false;
    }, (err) => {
      this.hideLoading();
    });
  }

  saveProgress(cb = () => {}) {
    this._LEProgressService.update({
      current_course_module_section: this.leModule.sections[this.currentSectionIndex].section_id,
      current_course_module: this.leModule.id
    }).subscribe((res) => {
      // this.showToast('Updated LE Progress');
      cb();
    });
  }

  nextSection() {
    if (this.slides.toArray()[this.currentSectionIndex].canSlide(1).canSlide) {
      if (this.currentSectionIndex < this.sectionsCount-1) {
        this.currentSectionIndex++;
        this.saveProgress();
        this.sliding = true;
        setTimeout(() => {
          this.sliding = false;
        }, 250);
      }
      this.hideFab = true;
    } else if (!this.slides.toArray()[this.currentSectionIndex].canSlide(1).canSlide && this.slides.toArray()[this.currentSectionIndex].canSlide(1).reason) {
      this.presentToast(this.slides.toArray()[this.currentSectionIndex].canSlide(1).reason);
    }


  }

  prevSection() {
    if (this.slides.toArray()[this.currentSectionIndex].canSlide(-1).canSlide) {
      if (this.currentSectionIndex > 0) {
        this.currentSectionIndex--;
        this.saveProgress();
        this.sliding = true;
        setTimeout(() => {
          this.sliding = false;
        }, 250);
      }
      this.hideFab = true;
    } else if (!this.slides.toArray()[this.currentSectionIndex].canSlide(-1).canSlide && this.slides.toArray()[this.currentSectionIndex].canSlide(-1).reason) {
      this.presentToast(this.slides.toArray()[this.currentSectionIndex].canSlide(-1).reason);
    }

  }

  // goToSection(index) {
  //   if (this.currentSectionIndex > index) {
  //     let tick = setInterval(() => {
  //       if (this.currentSectionIndex > index) {
  //         this.currentSectionIndex--;
  //       } else {
  //         this.sliding = true;
  //         setTimeout(() => {
  //           this.sliding = false;
  //         }, 250);
  //         clearInterval(tick);
  //       }
  //     }, 250);
  //   } else if (this.currentSectionIndex < index) {
  //     let tick = setInterval(() => {
  //       if (this.currentSectionIndex < index) {
  //         this.currentSectionIndex++;
  //       } else {
  //         this.sliding = true;
  //         setTimeout(() => {
  //           this.sliding = false;
  //         }, 250);
  //         clearInterval(tick);
  //       }
  //     }, 250);
  //   }
  //   this.currentSectionIndex = index;
  //   this.hideFab = true;
  // }

  // setupLocking(activeIndex) {
  //   if (activeIndex > this.sectionsCount-1) {
  //     activeIndex = this.sectionsCount-1;
  //     this.slides.slideTo(activeIndex, 0);
  //   }
  //
  //   if (activeIndex == this.sectionsCount-1) {
  //     this.slides.lockSwipeToNext(true);
  //   } else if (activeIndex < this.sectionsCount-1) {
  //     this.slides.lockSwipeToNext(false);
  //   }
  //   if (activeIndex <= 0) {
  //     this.slides.lockSwipeToPrev(true);
  //   } else {
  //     this.slides.lockSwipeToPrev(false);
  //   }
  // }

  // slideChanged() {
  //   this.hideFab = true;
  //   let activeIndex = this.slides.getActiveIndex();
  //   this.setupLocking(activeIndex);
  //   // if (this.leModule.sections[activeIndex].type === 'image') {
  //   //   this.slides.zoom = true;
  //   // } else {
  //   //   this.slides.zoom = false;
  //   // }
  //   this.currentSectionIndex = activeIndex;
  // }

  bookmarkSection() {
    this.showToast('Section Bookmarked');
  }

  isScrolling: boolean = false;
  private didStartAtSide = false;
  pan($event: any, type) {
    if ($event.srcElement.nodeName !== 'VIDEO') {
      switch(type) {
        case 'start':
          this.didStartAtSide = false;

          if (this.slideStartX < 0) {
            if (
              $event.targetTouches[0].clientX <= this.sideSwipeTrigger ||
              $event.targetTouches[0].clientX >= window.innerWidth - this.sideSwipeTrigger
            ) {
              this.didStartAtSide = true;
              this.lockScrolling($event, false);
            }
            // $event.preventDefault();
            // $event.stopPropagation();
            this.slideStartScrollY = document.getElementsByClassName('activeSection')[0].scrollTop;

            if (document.getElementsByClassName('activeFlexboxScrollSection').length) {
              this.slideStartScrollY = document.getElementsByClassName('activeFlexboxScrollSection')[0].scrollTop;
            }
            this.slideStartTime = new Date().getTime();
            this.slideStartX = $event.targetTouches[0].clientX;
            this.slideStartY = $event.targetTouches[0].clientY;
          }
          break;
        case 'end':
          let slideEndTime = new Date().getTime();
          let slideTo = this._platform.width() / 2;

          // panning
          let velocityX = this.slideDeltaX / (slideEndTime - this.slideStartTime);

          //swipe down
          let velocityY = this.slideDeltaY / (slideEndTime - this.slideStartTime);

          // figure out what to do

          if (Math.abs(velocityY) >= .7 && this.slideDeltaY > 0 && this.slideStartScrollY <= 0 && (Math.abs(this.slideDeltaXHidden) < (this.slideTrigger / 1.5))) {
            this.goBack();
          } else {
            if (this.didStartAtSide) {
              if (Math.abs(this.slideDeltaXHidden) > this.slideTrigger) {
                if (this.slideDeltaX > slideTo) {
                  this.prevSection();
                } else if (this.slideDeltaX < slideTo * -1) {
                  this.nextSection();
                } else if (this.slideDeltaX == 0) {
                  // this means we cancelled the swiping because of the canSlide check, lets try and show a toast if there is one.
                  let slideSwipeDirection = 1;
                  if (this.slideDeltaXHidden > 0) { // if its positive, that means we're swiping back.
                    slideSwipeDirection = -1
                  }
                  if (!this.slides.toArray()[this.currentSectionIndex].canSlide(slideSwipeDirection).canSlide) {
                    if (this.slides.toArray()[this.currentSectionIndex].canSlide(slideSwipeDirection).reason) {
                      this.presentToast(this.slides.toArray()[this.currentSectionIndex].canSlide(slideSwipeDirection).reason);
                    }
                  }
                } else {
                  if (Math.abs(velocityX) >= .5) {
                    if (this.slideDeltaX > 0) {
                      this.prevSection();
                    } else if (this.slideDeltaX < 0) {
                      this.nextSection();
                    }
                  }
                }
              }
            } else {
              if (Math.abs(velocityX) >= .7) {
                if (this.slideDeltaXHidden > 0) {
                  this.prevSection();
                } else if (this.slideDeltaXHidden < 0) {
                  this.nextSection();
                }
              }
            }
          }



          this.unlockScrolling();
          this.slideDeltaX = 0;
          this.slideDeltaY = 0;
          this.slideDeltaXHidden = 0;
          this.slideStartX = -1;
          this.slideStartY = -1;
          this.slideInitialDirection = 0;
          this.slideStartScrollY = 1;
          this.isScrolling = false;
          this.slideStartTime = undefined;

          this.contentNativeElement.style.transform = 'translateY(' + this.slideDeltaY + 'px)';
          this.parentElement.style.opacity = 1 - (this.slideDeltaY / 400);
          break;
        case 'move':
          this.slideDeltaY = $event.targetTouches[0].clientY - this.slideStartY;
          this.slideDeltaXHidden = $event.targetTouches[0].clientX - this.slideStartX;
          if (this.didStartAtSide) {
            this.lockScrolling($event, false);
          }

          if (document.getElementsByClassName('activeFlexboxScrollSection').length) {
            if (this.slideStartScrollY != document.getElementsByClassName('activeFlexboxScrollSection')[0].scrollTop) {
              this.isScrolling = true;
            }
          } else {
            if (this.slideStartScrollY != document.getElementsByClassName('activeSection')[0].scrollTop) {
              this.isScrolling = true;
            }
          }
          if (!this.isScrolling) {
            if (this.didStartAtSide) {
              let slideSwipeDirection = 1;
              if (this.slideDeltaXHidden > 0) { // if its positive, that means we're swiping back.
                slideSwipeDirection = -1
              }
              if (Math.abs(this.slideDeltaXHidden) > this.slideTrigger && this.slides.toArray()[this.currentSectionIndex].canSlide(slideSwipeDirection).canSlide) {
                this.slideDeltaX = $event.targetTouches[0].clientX - this.slideStartX;
              } else {
                this.slideDeltaX = 0;
              }
            }
          }

          if (this.slideInitialDirection === 0) {
            if (this.slideDeltaY > 0) {
              this.slideInitialDirection = -1;
            } else if (this.slideDeltaY < 0) {
              this.slideInitialDirection = 1;
            }
          } else if (this.slideInitialDirection < 0) {
            if (this.slideStartScrollY <= 0 && (Math.abs(this.slideDeltaXHidden) < (this.slideTrigger / 1.5))) {
              $event.preventDefault();
              // $event.stopImmediatePropagation();
              $event.stopPropagation();
              if (this.slideDeltaY > 0) {
                this.contentNativeElement.style.transform = 'translateY(' + this.slideDeltaY + 'px)';
                this.parentElement.style.opacity = 1 - (this.slideDeltaY / 400);
              }
              this.lockScrolling($event);
            } else {
              this.contentNativeElement.style.transform = 'translateY(' + 0 + 'px)';
              this.parentElement.style.opacity = 1;
            }
          }

          break;
      }
    }


  }

  lockScrolling($event, setScrollTop=true) {

    if (setScrollTop) {
      let e = <HTMLElement>document.getElementsByClassName('activeSection')[0];
      e.scrollTop = 0;
    }
    $event.preventDefault();
    // $event.stopImmediatePropagation();
    $event.stopPropagation();

  }

  unlockScrolling() {
    // let e = <HTMLElement>document.getElementsByClassName('activeSection')[0];
  }


  toggleFab($event) {
    if (!$event.srcEvent.hasOwnProperty('noFab')) {
      this.hideFab = !this.hideFab;
    }
  }

  goBack(dataToPass?:any) {
    this.loading = true;
    // this._nav.pop({
    //   animation: 'md-transition',
    // });
    this.moduleListCallback(dataToPass).then(()=>{
      this._nav.pop();
    });
    // this._viewController.dismiss(dataToPass);
  }

  ngOnDestroy() {
    this.statusBar.show();
    document.removeEventListener('resume', this.windowListenerFunction);
    // this.statusBar.isVisible = true;
  }

  currentProgress() {

    return this.currentSectionIndex / (this.sectionsCount-1) * 100 + "%";
  }

}
