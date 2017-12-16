import {
  Component, AfterViewInit, Input, OnInit, ElementRef, AfterContentChecked, OnChanges,
  SimpleChanges, ViewChild, Output, EventEmitter, OnDestroy, Renderer2
} from '@angular/core';
import { NavController, Slides, Platform } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { LEProgressService } from '../../shared/services/le-progress.service';
import { QuizComponent } from '../quiz/quiz';
import { StorageService } from '../../shared/services/storage.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'learning-experience-section',
  templateUrl: 'learning-experience-section.html'
})

export class LearningExperienceSectionComponent implements AfterViewInit, OnInit, AfterContentChecked, OnChanges, OnDestroy {

  @Output()
  public goToList: EventEmitter<any> = new EventEmitter();

  @Output()
  public goToNext: EventEmitter<any> = new EventEmitter();

  @ViewChild('subSlides')
  public slides: Slides;

  public quiz: QuizComponent;
  @ViewChild('quiz') set content(content: QuizComponent) {
    this.quiz = content;
    // console.log('we have a quiz!', this.quiz);
  }

  @ViewChild('sectionElement')
  public sectionElement: ElementRef;

  @Input()
  public section: any;

  @Input()
  public isNext: boolean;

  @Input()
  public isPrev: boolean;

  @Input()
  public isLower: boolean;

  @Input()
  public isHigher: boolean;

  @Input()
  public slideDeltaX: number = 0;

  @Input()
  public currentIndex: number;

  @Input()
  public index: number = 0;

  @Input()
  public visible: boolean = false;

  @Input()
  public scrollable: boolean = false;

  @Input()
  public editMode: boolean = false;

  sectionHeight: number;

  notActiveHeight = window.innerHeight - 10;

  realElement: HTMLDivElement;
  maxWidth: number;

  highestSlideIndex: number = 0;

  videoComplete: boolean;

  shortTextSection: boolean = false;

  oneTime: boolean = false;
  constructor(
    public _LEProgressService: LEProgressService,
    private _nav: NavController,
    private photoViewer: PhotoViewer,
    private _renderer: Renderer2,
    private _localStorage: StorageService,
    private _element: ElementRef,
    private _platform: Platform
  ) {
  }

  ngOnInit() {
    if (!this.editMode) {
      console.log('not in edit mode!');
      this.videoComplete = this._LEProgressService.getOrSet(this.section['section_id'], 'videoComplete', false);
      this.highestSlideIndex = this._LEProgressService.getOrSet(this.section['section_id'], 'highestSlideIndex', 0);
    }

  }

  ngOnDestroy() {
    if (this.rotationListener) {
      this.rotationListener();
    }
  }

  private rotationListener;
  ngAfterViewInit() {
    this.realElement = this._element.nativeElement.children[0];

    if (!this.editMode){
      this.rotationListener = this._renderer.listen("body", "orientationchange", ($event) => {
        this.sectionHeight = this.realElement.offsetHeight;
        this.realElement.style.width = window.innerWidth + 'px';
        this.maxWidth = parseInt(this.realElement.offsetWidth+'');
        this.setLeft();
        this.shortTextSection = this.isShortTextSection();
      });


      this.sectionHeight = this.realElement.offsetHeight;
      this.realElement.style.width = this.realElement.offsetWidth + 'px';
      this.maxWidth = parseInt(this.realElement.offsetWidth+'');
      this.shortTextSection = this.isShortTextSection();


      if (this.sectionHeight < window.innerHeight) {
        this.sectionHeight = window.innerHeight;
      }
      this.setLeft();
      if (this.visible) {
      } else {
        // this.setHiddenHeight();
      }
      if (typeof this.slides !== 'undefined') {
        this.setupSlides();
      }
    }

    setTimeout(() => { //not sure why we can't just set this in the hmtl...
      this.realElement.classList.add('le-section');
    }, 10);

    // is a video
    if (this.section.hasOwnProperty('vimeo')) {
      this.getUrlForVideo().subscribe((res) => {
        this.section.vimeo.src = res;
      });
    }

  }

  setupSlides() {
    let sliderSetupTimer = setInterval(() => {
      if (typeof this.slides._slides !== 'undefined') {
        clearInterval(sliderSetupTimer);
        sliderSetupTimer = undefined;
        this.setupLocking(0);
      }
    }, 100);
  }

  panPrevent($event) {
    $event.preventDefault();
    $event.srcEvent.stopPropagation();
    $event.srcEvent.preventDefault();
    return false;
  }

  slideChanged() {
    this.setupLocking(this.slides.getActiveIndex());
    if (this.highestSlideIndex < this.slides.getActiveIndex()) {
      this.highestSlideIndex = this.slides.getActiveIndex();
      if (!this.editMode) {
        this._LEProgressService.updateObjectField(this.section['section_id'], 'highestSlideIndex', this.highestSlideIndex).subscribe(() => {
          //
        });
      }
    }
  }

  setupLocking(activeIndex) {
    let length = this.slides._slides.length;
    if (activeIndex > length-1) {
      activeIndex = length-1;
      this.slides.slideTo(activeIndex, 0);
    }

    if (activeIndex == length-1) {
      this.slides.lockSwipeToNext(true);
    } else if (activeIndex < length-1) {
      this.slides.lockSwipeToNext(false);
    }
    if (activeIndex <= 0) {
      this.slides.lockSwipeToPrev(true);
    } else {
      this.slides.lockSwipeToPrev(false);
    }
  }

  ngAfterContentChecked() {
  }

  setHiddenHeight() {
    // this.realElement.style.height = this.notActiveHeight + 'px';
  }

  setVisibleHeight() {
    // this.realElement.style.height = this.sectionHeight + 'px';
  }

  setLeft() {
    if (this.isLower && this.isPrev) {
      let left = (this.maxWidth * -1);
      this.realElement.style.left = left + 'px';
    } else if (this.isLower) {
      let left = (this.maxWidth * -1) * 3;
      this.realElement.style.left = left + 'px';
    } else if (this.isHigher && this.isNext) {
      let left = (this.maxWidth);
      this.realElement.style.left = left + 'px';
    } else if (this.isHigher) {
      let left = (this.maxWidth) * 3;
      this.realElement.style.left = left + 'px';
    } else {
      let left = 0;
      this.realElement.style.left = left + 'px';
    }
  }

  slideLeft() {
    if (this.slideDeltaX === 0) {
      this.realElement.classList.add('animate');
    } else {
      this.realElement.classList.remove('animate');
    }
    let left = 0;
    if (this.isLower && this.isPrev) {
      left = (this.maxWidth * -1);
      if (this.slideDeltaX > 0) {
        left = left + Math.abs(this.slideDeltaX);
      } else if (this.slideDeltaX < 0) {
        left = left - Math.abs(this.slideDeltaX);
      }
    } else if (this.isHigher && this.isNext) {
      left = (this.maxWidth);
      if (this.slideDeltaX > 0) {
        left = left + Math.abs(this.slideDeltaX);
      } else if (this.slideDeltaX < 0) {
        left = left - Math.abs(this.slideDeltaX);
      }
    } else if (this.visible) {
      left = (this.slideDeltaX);
    } else {
      if (this.isHigher) {
        left = (this.maxWidth * 1);
      } else if (this.isLower) {
        left = (this.maxWidth * -1);
      }
    }
    this.realElement.style.left = left + 'px';

  }

    ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('visible') && typeof this.realElement !== 'undefined') {
      if (changes['visible'].currentValue === true) {
        this.setVisibleHeight();
      } else {
        this.setHiddenHeight();
      }
    }
      if (changes.hasOwnProperty('slideDeltaX') && typeof this.realElement !== 'undefined') {
        this.slideLeft();
      }
    if (changes.hasOwnProperty('currentIndex') && typeof this.realElement !== 'undefined') {
      this.realElement.classList.add('animate');
      this.setLeft();
    }
  }

  endedEvent($event) {
    if (!this.editMode) {
      this.videoComplete = true;
      this._LEProgressService.updateObjectField(this.section['section_id'], 'videoComplete', this.videoComplete).subscribe((res)=>{
        //
      });
      // console.log($event);
    }

  }

  viewImage(src) {
    this.photoViewer.show(src, undefined, {share: false});
  }

  preventEvent($event) {
    // console.log($event);
    $event.preventDefault();
    $event.cancelBubble = true;
    $event.stopPropagation();
  }

  canSlide(increment:number=1) {
    // console.log('canSlide test', increment);
    if (increment === 1) {
      // Don't allow 'end_of_module' to swipe forward.
      if (this.section.type == "end_of_module") {
        return { canSlide:false , reason:null};
      }

      // Don't allow swipe forward if its a quiz and all answers are not correct.
      if (this.section.type == "quiz" && !this.quiz.quizComplete()) {
        return { canSlide:false , reason:"You must correctly answer this quiz."};
      }

      // Don't allow swipe forward if you haven't finished the video.
      if (this.section.type == "video" && !this.videoComplete) {
        return { canSlide:false , reason:"You must finish watching the video."};
      }

      // Don't allow swipe forward if you haven't looked through the gallery images.
      if (this.section.type == "gallery") {
        if (this.highestSlideIndex < this.slides.length()-1) {
          return { canSlide:false , reason:"You must view all the images in the gallery."};
        }
      }
    }

    if (increment === -1) {
      // don't allow first slide to swipe back.
      if (this.currentIndex === 0) {
        return { canSlide:false , reason:null};
      }
    }


    return { canSlide:true , reason:null };
  }

  getUrlForVideo() {
    return Observable.create((subscriber) => {

      let videoQuality = "Low";
      this._localStorage.get('videoQuality').then((videoQuality) => {
        if (videoQuality == "Low" || videoQuality == "Medium" || videoQuality == "High") {
          videoQuality = videoQuality;
        } else {
          videoQuality = "Low";
        }

        // console.log(videoQuality);
        // console.log(this.section);
        let videoQualities = [];
        let index = 0;
        for (let video of this.section.vimeo.download) {
          if (video.quality !== 'source') {  // we never want the source file, its too big!
            videoQualities.push({index: index, size: video.size, link: video.link});
          }
          index++;
        }
        console.log('before sort', videoQualities);

        videoQualities.sort((a, b) => {
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

  isShortTextSection() {
    if (this.section.type == "text") {
      // if (!this.oneTime) {
      //   console.log(this.sectionElement.nativeElement.scrollHeight < (this._platform.height() - 45));
      //   console.log(this.sectionElement.nativeElement);
      //   this.oneTime = true;
      // }
      return this.sectionElement.nativeElement.scrollHeight < (this._platform.height() - 45);
    } else {
      return false;
    }

  }

}
