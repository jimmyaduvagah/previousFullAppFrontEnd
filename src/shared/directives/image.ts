import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Content, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { StorageService } from '../services/storage.service';

@Directive({
  selector: '[Image]'
})
export class ImageDirective implements OnInit, AfterViewInit, OnDestroy {

  //TODO: extend ION-IMG

  @Input()
  useCache: boolean = false;

  @Input()
  placeholder: string; // TODO: implement placeholder images

  @Input()
  backgroundColor: string;

  @Input()
  fallback: string = 'assets/imgs/fallback.jpg';

  @Input()
  resize: string;

  @Input()
  asCircle: boolean = false; // TODO: implement this

  @Input()
  type: string = 'any';

  @Input()
  imageSrc: string = '';

  @Input()
  localImage: boolean = false;

  @Input()
  autoSetHeight: boolean = false;

  @Input()
  backgroundSize: string = 'contain';

  @Input()
  imageSize: { width: number, height: number };

  @Input()
  lazyLoad: boolean = false;

  @Input()
  public localCache: boolean = true;

  unloadedSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  displayElementType: string = 'IMG';


  public width: number = 0;
  public height: number = 0;
  public imageFound: Function = () => {
  };
  public imageNotFound: Function = () => {
  };
  private _subscriptions: Subscription[] = [];
  private _activeSrc = '';

  constructor(public _element: ElementRef,
              public _platform: Platform,
              public _storage: StorageService,
              public contentElement: Content) {
    this.imageFound = this.imageFoundFunction();
    this.imageNotFound = this.imageNotFoundFunction();
    this.displayElementType = this._element.nativeElement.nodeName;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setupImage();
  }

  setupImage() {
    switch (this.type) {
      case 'avatar':
        this.placeholder = 'assets/imgs/user_male.png';
        this.fallback = 'assets/imgs/user_male.png';
        break;
    }
    if (this.imageSrc === 'null' || this.imageSrc === null || this.imageSrc === undefined || (!this.imageSrc.match(/^http/) && !this.localImage )) {
      this.imageSrc = this.fallback;
      this.useCache = false;
    }
    this.setBackgroundColor();
    if (this.isVisible()) {
      this.setElementImage(this.imageSrc);
    } else {
      // this.setElementImage(this.imageSrc);
    }
    if (this.autoSetHeight) {
      this.setupHeight();
    }
    this.addListeners();
  }

  setupHeight() {
    this.width = this._element.nativeElement.parentElement.offsetWidth;
    this.height = (this.width * this.imageSize.height) / this.imageSize.width;
    this._element.nativeElement.style.minHeight = this.height + 'px';
  }

  imageFoundFunction() {
    // let _that = this;
    return ($event) => {

    }
  }

  imageNotFoundFunction() {
    // let _that = this;
    return ($event) => {
      if (typeof this.fallback !== 'undefined') {
        this.useCache = false;
        this.setElementImage(this.fallback);
      }
    }
  }

  addListeners() {
    this._element.nativeElement.addEventListener('load', this.imageFound);
    this._element.nativeElement.addEventListener('error', this.imageNotFound);
    if (this.lazyLoad) {
      this.listenToScroll();
    }
  }

  removeListeners() {
    this._element.nativeElement.removeEventListener('load', this.imageFound);
    this._element.nativeElement.removeEventListener('error', this.imageNotFound);
    for (let s of this._subscriptions) {
      s.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  toDataURL(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      let reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  isImageCached(url) {
    return this._storage.getImage(url);
  }
  setElementImage(imageSrc) {
    this._activeSrc = imageSrc;
    if (imageSrc === '') {
      this.setSrcToElement('');
      return;
    }
    if (!imageSrc.match(/^data/)) {
      if (this.useCache) {
        imageSrc = 'https://platform.tunaweza.com/api/v1/images/cache/?url=' + encodeURIComponent(imageSrc);
      }
      // made the resize always get checked.
      // if (!this._platform.is('core')) {
      if (typeof this.resize !== 'undefined') {
        if (imageSrc.includes('?')) {
          imageSrc = imageSrc + '&r=' + this.resize;
        } else {
          imageSrc = imageSrc + '?r=' + this.resize;
        }
      }
      // }
      if (this.localCache) {
        this.isImageCached(imageSrc).then((res) => {
          if (typeof res !== 'undefined' && res !== null) {
            imageSrc = res;
            // console.log('using cache for', imageSrc);
          } else {
            // console.log('not cached for', imageSrc);
            this.toDataURL(imageSrc, (dataUrl) => {
              this._storage.storeImage(imageSrc, dataUrl)
            });
          }
          this.setSrcToElement(imageSrc);
        });
      } else {
        this.setSrcToElement(imageSrc);
      }
    }
  }

  setSrcToElement(imageSrc) {
    switch (this.displayElementType) {
      case 'DIV':
        this._element.nativeElement.style.backgroundRepeat = 'no-repeat';
        this._element.nativeElement.style.backgroundSize = this.backgroundSize;

        this._element.nativeElement.style.backgroundImage = 'url(' + imageSrc + ')';
        break;
      case 'IMG':
        this._element.nativeElement.src = imageSrc;
        break;
    }
  }

  setBackgroundColor() {
    if (this.backgroundColor) {
      // if (this.displayElementType === 'DIV') {
        this._element.nativeElement.style.backgroundColor = this.backgroundColor;
      // }
    }
  }

  unLoad() {
    if (this._activeSrc !== this.unloadedSrc) {
      // this._element.nativeElement.style.visibility = 'hidden';
      this.setElementImage('');
    }
  }

  load() {
    if (this._activeSrc !== this.imageSrc) {
      // this._element.nativeElement.style.visibility = 'visible';
      this.setElementImage(this.imageSrc);
    }
  }

  listenToScroll() {
    // this._subscriptions.push(this.contentElement.ionScroll.subscribe(($event) => {
    //   // console.log('----', this.contentElement.isScrolling);
    //   if (this.isVisible()) {
    //     this.load();
    //   } else {
    //     this.unLoad();
    //   }
    // }));
    // this._subscriptions.push(this.contentElement.ionScrollStart.subscribe(($event) => {
    //   // console.log('Start');
    //   if (typeof this.scrollListener === 'undefined') {
    //     if (this.isVisible()) {
    //       this.load();
    //     } else {
    //       this.unLoad();
    //     }
    //   }
    // }));
    
    if (this.contentElement) {
      this._subscriptions.push(this.contentElement.ionScrollEnd.subscribe(($event) => {
        setTimeout(() => {
          if (this.isVisible()) {
            this.load();
          } else {
            this.unLoad();
          }
        }, 1);
      }));
    }
  }

  isVisible() {
    if (!this.lazyLoad) {
      return true;
    }

    let viewportHeight = window.innerHeight;
    let startLoadHeight = viewportHeight * -2;
    let endLoadHeight = viewportHeight * 3;
    return (
      (
        this._element.nativeElement.getBoundingClientRect().top > startLoadHeight &&
        this._element.nativeElement.getBoundingClientRect().bottom < endLoadHeight
      )
      ||
      (
        (
          this._element.nativeElement.getBoundingClientRect().bottom < endLoadHeight &&
          this._element.nativeElement.getBoundingClientRect().bottom > startLoadHeight
        )
        ||
        (
          this._element.nativeElement.getBoundingClientRect().top < endLoadHeight &&
          this._element.nativeElement.getBoundingClientRect().top > startLoadHeight
        )
      )
    );
  }

}



@Directive({
  selector: '[ToastImage]'
})
export class ToastImageDirective extends ImageDirective {

  constructor(public _element: ElementRef,
              public _platform: Platform,
              public _storage: StorageService
  ) {
    super(_element, _platform, _storage, null)
  }

}
