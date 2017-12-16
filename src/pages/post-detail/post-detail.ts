import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import {
  IonicPage, NavController, NavParams, IonicFormInput, TextInput,
  LoadingController, Loading, Platform
} from 'ionic-angular';
import { Post } from '../../shared/models/Post';
import { PostStore } from '../../shared/services/post.store';
import { FeedService } from '../../shared/services/feed.service';
import { CommentService } from '../../shared/services/comment.service';
import { Keyboard } from '@ionic-native/keyboard';
import { AnalyticsService } from '../../shared/services/analytics.service';

/**
 * Generated class for the PostDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html',
})
export class PostDetailPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('commentInput')
  commentInput: TextInput;

  private focusCommentInput: boolean = false;
  private post: Post;
  private comments: Post[] = [];
  private myComment: Post = new Post({});
  private postId: string;
  private loadingController: Loading;
  private commentsLoading: boolean = true;
  private posting: boolean = false;
  private postDoesNotExist: boolean = false;

  public keyboardOpenListener;
  public keyboardCloseListener;
  public keyboardOpen: boolean = false;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public _keyboard: Keyboard,
      private _postStore: PostStore,
      private loadingCtrl: LoadingController,
      private _commentService: CommentService,
      private _feedService: FeedService,
      private platform: Platform,
      private _analytics: AnalyticsService
  ) {
    // pass
    this.post = navParams.get('post');
    this.postId = navParams.get('postId');

    if (this.platform.is('ios')) {
      this.keyboardOpenListener = this._keyboard.onKeyboardShow().subscribe((e: any) => {
        // console.log('keyboard showed');
        // console.log(e.keyboardHeight);
        this.inputResize(e.keyboardHeight);
        this.keyboardOpen = true;
      });

      this.keyboardCloseListener = this._keyboard.onKeyboardHide().subscribe((e: any) => {
        // console.log('keyboard hide');
        // console.log(e.keyboardHeight);
        this.inputResize();
        this.keyboardOpen = false;
      });
    }

  }

  inputResize(keyboardHeight?:number) {
    // console.log('labelItem', this.labelItem);
    // console.log('textArea', this.textArea);
    // check if this is iOS...
    if (keyboardHeight) {
      this.commentInput.getNativeElement().parentElement.parentElement.style.marginBottom = keyboardHeight + 'px';
    } else {
      this.commentInput.getNativeElement().parentElement.parentElement.style.marginBottom = null;
    }
  }



  ionViewDidLoad() {
    this._analytics.logScreenView(this.constructor.name);
  }

  ngOnInit(){
    if (this.post) {
      this.setup()
    } else {
      this.showLoading();
      this._feedService.get(this.postId).subscribe((post) => {
        this.post = post;
        this.setup();
        this.hideLoading();
      }, (err) => {
        this.postDoesNotExist = true;
        this.hideLoading();
      });
    }

  }

  setup() {
    this.getComments();
    this.myComment.text_content = "";
    this.myComment.parent_post = this.post.id;
    this.myComment.post_type = 1;
  }
  showLoading() {
    this.loadingController = this.loadingCtrl.create({
      content: `Loading`
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss(null, null, {
      duration: 0
    });
  }
  ngAfterViewInit(){
    this.focusCommentInput = this.navParams.get('focusCommentInput');
    console.log('ionViewDidLoad PostDetailPage');
    if (this.focusCommentInput) {
      this.showLoading();
      setTimeout(() => {
        this.hideLoading();
      }, 1250);
      setTimeout(() => {
        this.focusOnCommentInput();
      }, 1300);
      this.focusCommentInput = false;
    }
  }

  public postComment() {
    this.posting = true;
    this.myComment.text_content = this.myComment.text_content.trim();
    if (this.myComment.text_content.length) {
      console.log(this.myComment.text_content);
      console.log(this.myComment.parent_post);
      this._feedService.post(this.myComment).subscribe((res) => {
        this.clearComment();
        this.closeKeyboard();
        this.refreshPostData();
        this.getComments();
        this.posting = false;
      }, (err) => {
        this.posting = false;
        console.log(err);
      });
    }
  }

  public clearComment() {
    // this.myComment = null;
    this.myComment.text_content = "";
  }

  public refreshPostData() {
    console.log('refresh post data called');
    this._feedService.get(this.post.id).subscribe((res) => {
      this.post = res;
      this._postStore.updateStoreItem(this.post);
    })
  }

  public getComments() {
    this.commentsLoading = true;
    this._commentService.getListForPost(this.post.id).subscribe((res) => {
      this.comments = res.results;
      this.commentsLoading = false;
    });
    //
  }

  private focusOnCommentInput($event?:any){
    this.commentInput.setFocus();
  }

  private inputFocusCallback(): Function {
    return () => {
      setTimeout(() => {

        this.commentInput.setFocus();
      }, 600);
    }
  }

  goBack() {
    this.navCtrl.pop();
  }


  private closeKeyboard() {
    this._keyboard.close();
  }

  ngOnDestroy() {
    if (this.platform.is('ios')) {
      this.keyboardOpenListener.unsubscribe();
      this.keyboardCloseListener.unsubscribe();
    }
  }

}
