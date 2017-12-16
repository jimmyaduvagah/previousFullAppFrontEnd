import { Component, OnDestroy, ViewChild } from '@angular/core';
import {
  Content, InfiniteScroll,
  Loading, LoadingController, NavController, NavParams, Refresher,
  ToastController, ViewController
} from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';
import { LearningExpereienceModuleService } from '../../shared/services/course-module.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Post } from '../../shared/models/Post';
import { PostStore } from '../../shared/services/post.store';
import { PostService } from '../../shared/services/post.service';
import { PostDetailPage } from '../post-detail/post-detail';
import { FeedNewPostPage } from '../feed-new-post/feed-new-post';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-learning-experience-section-comments',
  templateUrl: 'learning-experience-section-comments.html',
  providers: [PostStore, PostService],
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
export class LearningExperienceSectionCommentsPage implements OnDestroy {

  @ViewChild(Content)
  public contentView: Content;

  private loading: boolean = true;
  private loadingController: Loading;
  private section: any;

  private posts: Post[] = [];


  constructor(public statusBar: StatusBar,
              public _nav: NavController,
              public _navParams: NavParams,
              public _toast: ToastController,
              public _leModuleService: LearningExpereienceModuleService,
              public _sessionService: SessionService,
              public _feedService: PostService,
              public _viewCtrl: ViewController,
              private _postStore: PostStore,
              private loadingCtrl: LoadingController,
              private _analytics: AnalyticsService) {

    this.section = this._navParams.get('section');
    this.statusBar.show();
    this.showLoading();
    this.getPosts();
  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
    this._analytics.logEvent('learning-experience', 'navigated-to-section-comments', this.section.id + ':' + this.section.title);
  }

  showLoading() {
    this.loadingController = this.loadingCtrl.create({
      content: `Loading Comments`
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  getPosts(cb?) {
    this._feedService.getList({
      associated_object_id: this.section.id
    }).subscribe((res) => {
      this.posts = [];
      this.posts.push(...res.results);
      this.loading = false;
      if (typeof cb !== 'undefined') {
        cb();
      }
      this.hideLoading();
    }, (err) => {
      this.loading = false;
      this.hideLoading();
    });
  }

  goBack() {
    // this._viewCtrl.dismiss(null);
    this._nav.pop();
  }

  pan($event: any) {
    if (this.contentView.getScrollElement().scrollTop <= 0) {
      if ($event.isFinal === true) {
        if ($event.additionalEvent === 'panright') {
          setTimeout(() => {
            this.goBack();
          }, 1);
        }
      }
    }
  }
  loadMoreItems(infiniteScroll: InfiniteScroll) {
    infiniteScroll.complete();
  }

  goToPost(details:{'post':Post, 'focusCommentInput'?:boolean}) {
    // this.goToPostEvent.emit({'post':post, 'focusCommentInput':focusComment});
    // console.log(details);
    this._nav.push(PostDetailPage, details);
  }

  doRefresh(refresher: Refresher) {
    this.getPosts(() => {
      refresher.complete();
    });
  }

  public createPost() {
    // let modal = this.modalCtrl.create(FeedNewPostPage);
    // modal.present();
    this._analytics.logEvent('learning-experience', 'navigated-to-add-section-comment', this.section.id + ':' + this.section.title);
    this._nav.push(FeedNewPostPage, {
      associatedObjectId: this.section.id,
      callback: (post) => {
        this.posts.unshift(post)
      }
    });
  }

  ngOnDestroy() {
    this.statusBar.hide();
  }

}
