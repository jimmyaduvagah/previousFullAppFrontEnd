import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Post, Like } from '../../shared/models/Post';
import { PostStore } from '../../shared/services/post.store';
import { LikeService } from '../../shared/services/like.service';
import { PostDetailPage } from '../../pages/post-detail/post-detail';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'post-actions',
  templateUrl: 'post-actions.html'
})
export class PostActionsComponent implements OnInit {
  @Output()
  public goToPostEvent: EventEmitter<any> = new EventEmitter();
  @Input() post: Post;
  @Input() detail: boolean = false;
  @Input() comment: boolean = false;
  @Input() addCommentCallback: Function = () => {};

  @Output() likeEvent: EventEmitter<Post> = new EventEmitter();
  @Output() unLikeEvent: EventEmitter<Post> = new EventEmitter();
  myLike: Like;
  private likeLoading: boolean = false;
  constructor(private _likeService: LikeService,
              private _postStore: PostStore,
              private _nav: NavController,
  ) {
    //
  }

  ngOnInit() {
    // if this post has a my like id, get that from like service and set to this like.
    if (this.post.my_like) {
      this.myLike = new Like({post: this.post.id, id: this.post.my_like});
    }
  }

  goToComment() {

    // load that post detail page
    // [nsRouterLink]="['/authenticated/feed-post/'+item.id]"
    if (this.detail) {
      this.addCommentCallback();
    } else {
      this.goToPost(this.post, true);
    }


  }

  likes_count_comment_display() {
    let count = this.post.likes_count;
    let display = "";
    if (count === 1){
      display = "( 1 Like )"
    } else if (count > 1) {
      display = "( "+ count + "Likes )"
    }

    return display;
  }

  like() {
    this.likeLoading = true;
    this.myLike = new Like({post: this.post.id});
    this._likeService.post(this.myLike).subscribe((like) => {
      this.myLike = like;
      this.post.likes_count += 1;
      this.post.my_like = like.id;
      this.likeLoading = false;
      if (!this.comment){
        // if its not a comment we're liking, but a main post, update our post store.
        this._postStore.updateStoreItem(this.post);
      }
    }, (err) => {
      this.likeLoading = false;
    });
  }

  unLike() {
    this.likeLoading = true;
    this._likeService.delete(this.myLike.id).subscribe((res) => {
      this.myLike = null;
      this.post.my_like = null;
      this.post.likes_count -= 1;
      this.likeLoading = false;
      if (!this.comment) {
        // if its not a comment we're liking, but a main post, update our post store.
        this._postStore.updateStoreItem(this.post);
      }
    }, (err) => {
      this.likeLoading = false;
    });
  }

  inrementLike() {
    // should be an event emitter
  }

  decrementLike() {
    // should be an event emitter
  }

  goToPost(post:Post, focusComment?:boolean) {
    this.goToPostEvent.emit({'post':post, 'focusCommentInput':focusComment});
  }

}
