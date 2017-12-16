import { Component, AfterViewInit, Input, OnInit, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { Post } from '../../shared/models/Post';

@Component({
  selector: 'post-type-link',
  templateUrl: 'post-type-link.html'
})
export class PostTypeLinkComponent implements AfterViewInit, OnInit, OnDestroy {
  @Output()
  public goToPostEvent: EventEmitter<any> = new EventEmitter();

  @Input()
  public post: Post;
  public autoSetHeight: boolean = true;
  public imageSize: {width: number, height:number};
  @Input()
  public detail: boolean = false;

  constructor(
    public _feedService: PostService,
    private _navCtrl: NavController,
    private _elementRef: ElementRef
  ) {
  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    if (typeof this.post !== 'undefined') {
      this.imageSize = {
        width: parseInt(this.post.linked_content_object.data['image:width']),
        height: parseInt(this.post.linked_content_object.data['image:height'])
      };
      this.autoSetHeight = (this.imageSize.width > this.imageSize.height);
    }
  }

  ngOnDestroy () {

  }

  goToPost(post:Post) {
    this.goToPostEvent.emit({'post':post});
  }

}
