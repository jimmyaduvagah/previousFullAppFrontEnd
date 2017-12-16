import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams, Content } from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { PostStore } from '../../shared/services/post.store';
import { FeedNewPostPage } from '../feed-new-post/feed-new-post';
import { StatusBar } from '@ionic-native/status-bar';
import { twzColor } from '../../shared/utils/twz-color-util';
import { Post } from '../../shared/models/Post';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PostDetailPage } from '../post-detail/post-detail';
import { SessionService } from '../../shared/services/session.service';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: '1'})),
      transition('void => *', [
        style({opacity: '0'}),
        animate(200)
      ]),
      transition('* => void', [
        animate(500, style({opacity: '0'}))
      ])
    ])
  ]
})
export class FeedPage implements AfterViewInit, OnDestroy {

  @ViewChild(Content) content: Content;

  private postStoreSub;
  private loadMoreSub;
  private infiniteScrollObject;
  private endOfList: boolean = true;
  private placeholder: Post;
  private showPlaceholder: boolean = true;
  private refreshObject;
  private rootNavCtrl: NavController;

  constructor(public statusBar: StatusBar,
              public modalCtrl: ModalController,
              public navParams: NavParams,
              private navCtrl: NavController,
              private _analytics: AnalyticsService,
              public _feedService: PostService,
              private _sessionService: SessionService,
              private _postStore: PostStore,) {

    this.rootNavCtrl = navParams.get('rootNavCtrl') || navCtrl;
    this._sessionService.rootNav = this.rootNavCtrl;
    // this.getPosts();
    this.placeholder = {
      id: '0',
      modified_by_id: '',
      created_by_id: '',
      post_type_display: '',
      post_type: 1,
      text_content: '',
      likes_count: 0,
      shares_count: 0,
      comments_count: 0,
      number_of_edits: 0,
      modified_by: '',
      created_by: '',
      modified_on: new Date(),
      created_on: new Date(),
    }

  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this._analytics.getSelectedTab() === 0) {
        this._analytics.logScreenView(this.constructor.name);
      }
    }, 250);
  }

  ngAfterViewInit() {
    // this.statusBar.backgroundColorByHexString(twzColor.greenDarkHex);
    this.postStoreSub = this._postStore.store.subscribe((res) => {
      if (this.refreshObject) {
        this.refreshObject.complete();
        if (this.infiniteScrollObject) {
          this.infiniteScrollObject.enable(true);
        }
      }
      // this.loadingMore = false;

      if (this.infiniteScrollObject) {
        this.infiniteScrollObject.complete();
      }

    });

    this.setInitialFeedItems();
    let initialFeedItems = this._postStore.gotListEvent.subscribe((res) => {
      this.showPlaceholder = false;
      initialFeedItems.unsubscribe();
    });
  }

  ngOnDestroy() {
    if (typeof this.postStoreSub !== "undefined") {
      this.postStoreSub.unsubscribe();
    }
    if (typeof this.loadMoreSub !== "undefined") {
      this.loadMoreSub.unsubscribe();
    }
  }

  public setInitialFeedItems() {
    this._postStore.getList();

  }

  // getPosts() {
  //   this._feedService.getInfiniteList().subscribe((res) => {
  //     this.items = res;
  //   });
  // }

  doRefresh(refresher) {
    this.refreshObject = refresher;
    this.setInitialFeedItems();
  }

  public loadMoreItems(infiniteScroll) {
    this.infiniteScrollObject = infiniteScroll;

    // this.loadingMore = true;
    this._postStore.getNext();

    this.loadMoreSub = this._postStore.listDetails.subscribe((res) => {
      if (res.next) {
        this.endOfList = false;
      } else {
        this.endOfList = true;
        this.infiniteScrollObject.enable(false);
      }
      // this.loadingMore = false;

    });

  }

  public createPost() {
    // let modal = this.modalCtrl.create(FeedNewPostPage);
    // modal.present();
    this.rootNavCtrl.push(FeedNewPostPage);
  }


  goToPost(details:{'post':Post, 'focusCommentInput'?:boolean}) {
    // this.goToPostEvent.emit({'post':post, 'focusCommentInput':focusComment});
    // console.log(details);
    if (!this.content.isScrolling) {
      this.rootNavCtrl.push(PostDetailPage, details);
    }
  }

}
