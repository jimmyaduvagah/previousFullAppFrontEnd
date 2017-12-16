import { Component, ViewChild } from '@angular/core';
import {
  Content, Keyboard, Loading, LoadingController, ModalController,
  NavController, NavParams
} from 'ionic-angular';
import { Post } from '../../shared/models/Post';
import { PostStore } from '../../shared/services/post.store';
import { twzColor } from '../../shared/utils/twz-color-util';
import { SessionService } from '../../shared/services/session.service';
import { User } from '../../shared/models/User';
import { PostService } from '../../shared/services/post.service';
import { StatusBar } from '@ionic-native/status-bar';
import { FeedNewPostAddLinkPage } from "../feed-new-post-add-link/feed-new-post-add-link";
import { Observable } from "rxjs/Observable";
import { FeedNewPostAddPhotoPage } from "../feed-new-post-add-photo/feed-new-post-add-photo";
import { PhotoService } from '../../shared/services/photo.service';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-feed-new-post',
  templateUrl: 'feed-new-post.html'
})
export class FeedNewPostPage {

  @ViewChild(Content)
  public contentView: Content;
  private contentViewMarginBottom;
  private myPost: Post = new Post({});
  private user: User;
  private attachmentType: string;
  private attachment: any;
  private attachmentCollapsed: boolean = false;
  private posting: boolean = false;
  private loadingController: Loading;
  private initialLoading = true;
  public pageTitle: string = "New Post";

  private typesOfPosts: any = [
    {
      text: 'Link',
      icon: 'link',
      route: 'authenticated/create-post-add-link',
      color: twzColor.orangeDark
    },
    {
      text: 'Image',
      icon: 'image',
      route: 'authenticated/create-post-add-image',
      color: twzColor.greenDark
      // },
      // {
      //     text: 'Video',
      //     icon: 'videocam',
      //     route: 'authenticated/create-post-add-link',
      //     color: twzColor.blueDark
    }
  ];
  constructor(
      public statusBar: StatusBar,
      public keyboard: Keyboard,
      public navCtrl: NavController,
      public _navParams: NavParams,
      private loadingCtrl: LoadingController,
      private _sessionService: SessionService,
      private _feedService: PostService,
      private _postStore: PostStore,
      private _photoService: PhotoService,
      private _modalCtrl: ModalController,
      private _analytics: AnalyticsService
  ) {
    if (_sessionService.user) {
      this.user = _sessionService.user;
      this.setUpInitialData();
    } else {
      _sessionService.userObservable.subscribe((user) => {
        this.user = user;
        this.setUpInitialData();
      });
    }
  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }

  ngOnInit() {
    // this.statusBar.backgroundColorByHexString(twzColor.greenDarkHex);
  }

  showLoading() {
    this.loadingController = this.loadingCtrl.create({
      content: `Posting`
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  public setUpInitialData(){
    let associatedObjectId = this._navParams.get('associatedObjectId');
    if (typeof associatedObjectId !== 'undefined' && associatedObjectId !== null ) {
      this.myPost.associated_object_id = associatedObjectId;
      this.pageTitle = "Add to the Discussion";
    }
    this.myPost.post_type = 1;
    this.myPost.created_by_id = this.user.id;
    this.myPost.created_by = this.user.first_name + " " + this.user.last_name;
    this.myPost.text_content = "";
    this.myPost.my_like = null;
    this.myPost.profile_image = this.user.profile_image;
    this.initialLoading = false;
  }

  public canIPost(){
    let pt = this.myPost.post_type;
    if (pt == 1) {
      return this.myPost.text_content.trim().length;
    } else if (pt == 2 || 3 || 4) {
      return true;
    } else {
      return false;
    }

  }

  public postComment() {

    this.posting = true;
    this.myPost.text_content = this.myPost.text_content.trim();
    this.myPost.my_like = null;
    let analyticsEventName = 'user-made-new-text-post';
    if (this.canIPost()) {
      this.showLoading();
      this.closeKeyboard();
      if (typeof this.attachment !== 'undefined') {
        this.myPost.linked_content_object = this.attachment;
        analyticsEventName = 'user-made-new-post-with-attachment';
      }
      this._feedService.post(this.myPost).subscribe((post) => {
        this.clearComment();
        // Need to explicitly set this, it seems it doesn't come back from the server with anything and the
        // next view doesn't know what to do.
        post.my_like = null;
        this._analytics.logEvent('posts', analyticsEventName);

        this.goBack(post);
        this.hideLoading();
      }, (err) => {
        this.posting = false;
        this.hideLoading();
        alert('An error happened making your post, please try again.');
      });
    }
  }

  collapseAttachment() {
    this.attachmentCollapsed = true;
  }

  expandAttachment() {
    this.closeKeyboard();
    this.attachmentCollapsed = false;
  }

  clearAttachment() {
    this.contentView.getScrollElement().style.marginBottom = this.contentViewMarginBottom;
    this.attachment = undefined;
    this.attachmentType = undefined;
    this.myPost.post_type = 1; //set back to text
  }

  private addLinkModal;
  showAddLinkModal() {
    if (typeof this.addLinkModal === 'undefined') {
      return Observable.create(observer => {
        this.addLinkModal = this._modalCtrl.create(FeedNewPostAddLinkPage);
        this.addLinkModal.onDidDismiss(data => {
          observer.next(data);
          this.addLinkModal = undefined;
        });
        this.addLinkModal.present();
        return () => {
          //cleanup
        };
      });
    }
  }

  public addTypeOf(type: any) {
    switch (type.text) {
      case 'Link':
        let sub = this.showAddLinkModal().subscribe((res) => {
          if (res !== undefined) {
            if (res.display === 'horizontal') {
              this.myPost.post_type = 3;
            } else if (res.display === 'vertical') {
              this.myPost.post_type = 2;
            }
            this.addedAttachment();
            this.attachmentType = type.text;
            this.attachment = res;
          }
          sub.unsubscribe();
        });
        break;
      case 'Image':
        this._photoService.actionSheet().then((res) => {
            if (res !== undefined) {
              this.myPost.post_type = 4;
              this.addedAttachment();
              this.attachmentType = type.text;
              this.attachment = {
                image: res
              };
            }
        });

      break;
    }
  }

  public addedAttachment() {
    this.contentViewMarginBottom = this.contentView.getScrollElement().style.marginBottom;
    this.contentView.getScrollElement().style.marginBottom = '0';
  }

  public closeKeyboard() {
    this.keyboard.close();

  }

  public clearComment() {
    this.myPost.text_content = "";
  }

  public goBack(post) {

    let callback = this._navParams.get('callback');
    if (typeof callback !== 'undefined' && callback !== null) {
      callback(post);
    } else {
      // set the post to the store, then navigate back
      this._postStore.addStoreItem(post);
    }


    // this._routerExtensions.back();
    //TODO: close the modal
    this.dismiss();

  }

  public dismiss() {
    // this.viewCtrl.dismiss();
    this.navCtrl.pop();
  }

}
