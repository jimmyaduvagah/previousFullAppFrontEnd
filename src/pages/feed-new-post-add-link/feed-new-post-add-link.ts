import { Component } from '@angular/core';
import {
  Keyboard, Loading, LoadingController, NavController, Slides, ToastController,
  ViewController
} from 'ionic-angular';
import { PostStore } from '../../shared/services/post.store';
import { twzColor } from '../../shared/utils/twz-color-util';
import { SessionService } from '../../shared/services/session.service';
import { PostService } from '../../shared/services/post.service';
import { StatusBar } from '@ionic-native/status-bar';
import { Link } from "../../shared/models/Link";
import { LinkService } from "../../shared/services/link.service";
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-feed-new-post-add-link',
  templateUrl: 'feed-new-post-add-link.html'
})
export class FeedNewPostAddLinkPage {

  private link: Link = new Link({});
  private gettingLinkInfo: boolean = false;
  private currentLinkImage: number = 0;
  private numberOfImages: number = 0;
  private autoSetHeight: boolean = false;
  private imageSize: { width: number, height: number };
  private loadingController: Loading;


  constructor(public statusBar: StatusBar,
              public keyboard: Keyboard,
              public navCtrl: NavController,
              private _sessionService: SessionService,
              private _linkService: LinkService,
              private _feedService: PostService,
              private _postStore: PostStore,
              private _loadingCtrl: LoadingController,
              private _viewCtrl: ViewController,
              private _toastCtrl: ToastController,
              private _analytics: AnalyticsService) {

  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }

  ngOnInit() {
    // this.statusBar.backgroundColorByHexString(twzColor.greenDarkHex);
  }

  showLoading() {
    this.loadingController = this._loadingCtrl.create({
      content: 'Retrieving Link'
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }


  checkLink(callback?) {
    if (this.link._url.length == 0) {
      let toast = this._toastCtrl.create({
        message: 'please enter a url',
        duration: 1500,
        position: 'top'
      });
      toast.present();
    } else {
      this.showLoading();
      this.autoSetHeight = false;
      this.imageSize = undefined;
      if (!this.link._url.match(/:\/\//)) {
        this.link._url = 'http://' + this.link._url;
      }
      this.link = new Link({_url: this.link._url});
      this.gettingLinkInfo = true;
      this._linkService.post({
        content: this.link._url
      }).subscribe((res) => {
        this.gettingLinkInfo = false;
        if (res !== null) {
          if (res.hasOwnProperty('image:width') && res.hasOwnProperty('image:height')) {
            this.imageSize = {
              width: res['image:width'],
              height: res['image:height']
            };
            this.autoSetHeight = true;
          }
          this.link = res;
          if (this.imageSize === undefined) {
            let testImage = <HTMLImageElement>document.createElement('IMG');
            testImage.addEventListener('load', (res) => {
              if (testImage.naturalWidth >= 300) {
                this.imageSize = {
                  width: testImage.naturalWidth,
                  height: testImage.naturalHeight
                };
                this.link['image:width'] = this.imageSize.width.toString();
                this.link['image:height'] = this.imageSize.height.toString();
                this.autoSetHeight = true;
                this.link.display = 'vertical';
              }
              testImage = undefined;
            });
            testImage.src = this.link.image;
          }
          this.setUpInitialLinkDisplay();
          this.hideLoading();
          if (typeof callback !== 'undefined') {
            callback();
          }
        }
      }, (err) => {
        let toast = this._toastCtrl.create({
          message: 'an error occured when retrieving the link.',
          duration: 1500,
          position: 'top'
        });
        toast.present();
        this.hideLoading();
      });
    }
  }


  setUpInitialLinkDisplay() {
    this.currentLinkImage = 0;
    this.numberOfImages = 0;
    if (typeof this.link.image === 'undefined' && typeof this.link.images !== 'undefined') {
      this.numberOfImages = this.link.images.length;
      this.link.image = this.link.images[this.currentLinkImage];
    }
  }

  chooseNextImage() {
    if (this.link.images.hasOwnProperty((this.currentLinkImage + 1).toString())) {
      this.currentLinkImage++;
      this.link.image = this.link.images[this.currentLinkImage];
    }
  }

  choosePrevImage() {
    if (this.link.images.hasOwnProperty((this.currentLinkImage - 1).toString())) {
      this.currentLinkImage--;
      this.link.image = this.link.images[this.currentLinkImage];
    }
  }

  slideDidChange($event: Slides) {
    if (this.link.images.hasOwnProperty($event.getActiveIndex())) {
      this.link.image = this.link.images[$event.getActiveIndex()];
    }
  }


  public closeKeyboard() {
    this.keyboard.close();

  }


  public goBack() {
    this._viewCtrl.dismiss(undefined);
  }

  addLink() {
    if (
      this.link._url.length > 0 &&
      typeof this.link.url === 'undefined'
    ) {
      this.checkLink(()=>{
        this._viewCtrl.dismiss(this.link);
      });
    } else {
      this._viewCtrl.dismiss(this.link);
    }
  }

}
