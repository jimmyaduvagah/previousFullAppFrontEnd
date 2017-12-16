import { Component, AfterViewInit, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { Post } from '../../shared/models/Post';

@Component({
  selector: 'post-type-text',
  templateUrl: 'post-type-text.html'
})
export class PostTypeTextComponent implements AfterViewInit {

  @Input()
  public post: Post;

  constructor(
    private _navCtrl: NavController,
    public _feedService: PostService
  ) {
  }

  ngAfterViewInit() {
  }
}
