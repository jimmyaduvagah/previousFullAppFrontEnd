import { Component, AfterViewInit, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { Post } from '../../shared/models/Post';
import * as moment from "moment";
import { ProfilePage } from '../../pages/profile/profile';


@Component({
  selector: 'post-author',
  templateUrl: 'post-author.html'
})
export class PostAuthorComponent implements AfterViewInit, OnInit {
  @Output()
  public goToPostEvent: EventEmitter<any> = new EventEmitter();
  @Input()
  public post: Post;

  @Input()
  public placeholder: boolean;

  public postedTime: string;
  private rootNavCtrl: NavController;

  constructor(
    private _navCtrl: NavController,
    public _feedService: PostService,
    private _navParams: NavParams
  ) {
    this.rootNavCtrl = _navParams.get('rootNavCtrl') || _navCtrl;

  }

  ngOnInit() {
    if (this.post.created_on) {
      this.postedTime = moment(this.post.created_on).fromNow();
    }

  }

  ngAfterViewInit() {
  }

  typeToName(type) {
    switch(type) {
      case 'image':
        return 'Image';
      case 'link':
      case 'link-small-image':
        return 'Link';
      case 'text':
        return 'Text';
    }
  }

  typeToNameWithLead(type) {
    switch(type) {
      case 'image':
        return 'posted an Image';
      case 'link':
      case 'link-small-image':
        return 'shared a Link';
      case 'text':
        return 'posted some Text';
    }
  }

  goToUserProfile(userId) {
    let currentUserId = this._navParams.get('userId');

    if (currentUserId !== userId) {
      this.rootNavCtrl.push(ProfilePage, {
        userId: userId
      });
    }
  }

  goToPost(post:Post) {
    this.goToPostEvent.emit({'post':post});
  }

}
