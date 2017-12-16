import { Component, AfterViewInit, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionSheetController, NavController, ToastController } from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { Post } from '../../shared/models/Post';
import * as moment from "moment";
import { PostReportService } from '../../shared/services/post-report.service';


@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent implements AfterViewInit, OnInit {
  @Output()
  public goToPostEvent: EventEmitter<any> = new EventEmitter();

  @Input() addCommentCallback: Function = () => {};

  @Input()
  public post: Post;

  @Input()
  public placeholder: boolean;

  @Input()
  public comment: boolean = false;

  @Input()
  public detail: boolean = false;

  public postedTime: string;


  constructor(
    public _feedService: PostService,
    private _navCtrl: NavController,
    private _postReportService: PostReportService,
    private _toastCtrl: ToastController,
    private _actionSheetCtrl: ActionSheetController
  ) {

  }

  ngOnInit() {
    this.postedTime = moment(this.post.created_on).fromNow();
  }

  ngAfterViewInit() {
  }


  showToast(msg) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
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
        return 'an Image';
      case 'link':
      case 'link-small-image':
        return 'a Link';
      case 'text':
        return 'some Text';
    }
  }

  private postActionModal;
  showPostActions() {
    let actionSheet = this._actionSheetCtrl.create({
      buttons: [
        {
          text: 'Report Post',
          icon: 'flag',
          role: 'destructive',
          handler: () => {
            this._postReportService.post({
              post: this.post.id
            }).subscribe((res) => {
              this.showToast('Post has been reported');
            });
            console.log('Report Post');
          }
        },
        {
          text: 'Bookmark Post',
          icon: 'bookmark',
          handler: () => {
            this.showToast('Post has been bookmarked');
            console.log('Bookmark Post');
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  // goToPost(post:Post) {
  //   this.goToPostEvent.emit(post);
  // }

  goToPost(details:{'post':Post, 'focusCommentInput'?:boolean}) {
    // console.log(details);
    this.goToPostEvent.emit(details);
  }

}
