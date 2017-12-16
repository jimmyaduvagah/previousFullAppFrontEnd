import { Component, AfterViewInit, Input, OnInit, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { Post } from '../../shared/models/Post';

@Component({
  selector: 'post-type-link-small-image',
  templateUrl: 'post-type-link-small-image.html'
})
export class PostTypeLinkSmallImageComponent implements AfterViewInit, OnInit, OnDestroy {
  @Output()
  public goToPostEvent: EventEmitter<any> = new EventEmitter();

  @Input()
  public post: Post;

  public width: number = 0;
  public height: number = 0;
  public src: string;
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
      this.src = 'https://platform.tunaweza.com/api/v1/images/cache/?url=' + encodeURIComponent(this.post.linked_content_object.data.image);
      this.width = this._elementRef.nativeElement.children[0].offsetWidth;
      this.height = (this.post.linked_content_object.data['image:height'] * this.width) / this.post.linked_content_object.data['image:width'];
    }
  }

  ngOnDestroy () {

  }

  goToPost(post:Post) {
    this.goToPostEvent.emit({'post':post});
  }

}
