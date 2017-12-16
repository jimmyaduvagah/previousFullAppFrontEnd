import { Component, AfterViewInit, Input, OnInit, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { Post } from '../../shared/models/Post';
import { PhotoViewer } from "@ionic-native/photo-viewer";

@Component({
  selector: 'post-type-video',
  templateUrl: 'post-type-video.html'
})
export class PostTypeVideoComponent implements AfterViewInit, OnInit, OnDestroy {
  @Output()
  public goToPostEvent: EventEmitter<any> = new EventEmitter();

  @Input()
  public post: Post;

  @Input()
  public detail: boolean = false;

  public width: number = 0;
  public height: number = 0;
  public resizeMethod;


  constructor(
    private photoViewer: PhotoViewer,
    private _feedService: PostService,
    private _navCtrl: NavController,
    private _elementRef: ElementRef
  ) {
    this.resizeMethod = this.getResizeMethod(this);
    window.addEventListener('resize', this.resizeMethod);

  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    if (typeof this.post !== 'undefined') {
      this.resizeImage();
    }
  }

  getResizeMethod(that) {
    return ($event) => {
      that.resizeImage();
    }
  }

  resizeImage() {
    if (typeof this.post !== 'undefined') {
      this.width = this._elementRef.nativeElement.children[0].offsetWidth;
      this.height = (this.post.linked_content_object.height * this.width) / this.post.linked_content_object.width;
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeMethod);
  }

  viewImage() {
    this.photoViewer.show(this.post.linked_content_object.src, this.post.text_content, {share: true});
  }

  goToPost(post:Post) {
    this.goToPostEvent.emit({'post':post});
  }

}
