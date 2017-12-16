import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import {
  NavController, ModalController, LoadingController, Loading,
  InfiniteScroll, NavParams, ToastController, AlertController
} from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { ProfilePostStore } from '../../shared/services/profile-post.store';
import { StatusBar } from '@ionic-native/status-bar';
import { SessionService } from "../../shared/services/session.service";
import { User } from "../../shared/models/User";
import { UserService } from "../../shared/services/user.service";
import { ExperienceService } from "../../shared/services/experience.service";
import { ImageViewPage } from "../image-view/image-view";
import { ProfileEditPage } from "../profile-edit/profile-edit";
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Post } from '../../shared/models/Post';
import { PostDetailPage } from '../post-detail/post-detail';
import { SettingsPage } from '../settings/settings';
import { ProfilePostService } from '../../shared/services/profile-post.service';
import { ConnectionRequestService } from '../../shared/services/connection-request.service';
import { ConnectionService } from '../../shared/services/connection.service';
import { Connection } from '../../shared/models/Connection';
import { ProfileExperienceEditPage } from '../profile-experience-edit/profile-experience-edit';
import { ModalTextInputPage } from '../modal-text-input/modal-text-input';
import { LearningExperience } from '../../shared/models/LearningExperience';
import { LearningExperienceOverviewPage } from '../learning-experience-overview/learning-experience-overview';
import { AnalyticsService } from '../../shared/services/analytics.service';
import { ProfileLearningExperienceService } from '../../shared/services/profile-learning-experience.service';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements AfterViewInit, OnDestroy {


  user: User;
  userId: string;
  isSelf: boolean = false;
  currentUser: User;
  connectionRequest: Connection;
  loading: boolean = true;
  loadingController: Loading;
  jobExpereience = [];
  learningExperienceList: LearningExperience[] = [];
  learningExperienceListLoading: boolean = true;
  educationalExpereience = [];
  jobExpereienceLoading: boolean = true;
  educationalExpereienceLoading: boolean = true;
  postsLoading: boolean = true;
  usersPosts: Post[] = [];
  rootNavCtrl: NavController;

  constructor(public statusBar: StatusBar,
              public alertCtrl: AlertController,
              public _modalCtrl: ModalController,
              public _feedService: PostService,
              public photoViewer: PhotoViewer,
              private navCtrl: NavController,
              private _navParams: NavParams,
              private _toastCtrl: ToastController,
              private _connectionRequestService: ConnectionRequestService,
              private _connectionService: ConnectionService,
              private _userService: UserService,
              private _sessionService: SessionService,
              private _postService: ProfilePostService,
              private _experienceService: ExperienceService,
              private _leService: ProfileLearningExperienceService,
              private loadingCtrl: LoadingController,
              private _analytics: AnalyticsService) {
    // this.statusBar.backgroundColorByHexString(twzColor.blueDarkHex);
    this.rootNavCtrl = _navParams.get('rootNavCtrl') || navCtrl;
    this.showLoading();
    let userId = _navParams.get('userId');
    if (userId) {
      this.userId = userId;
    }
    if (_sessionService.user) {
      this.currentUser = _sessionService.user;
      this.getUser();
    } else {
      let sub = _sessionService.userObservable.subscribe((user) => {
        this.currentUser = user;
        sub.unsubscribe();
        this.getUser();
      });
    }

  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this._analytics.getSelectedTab() === 2) {
        this._analytics.logScreenView(this.constructor.name);
      } else if (this._navParams.get('userId')) {
        this._analytics.logScreenView(this.constructor.name);
      }
    }, 250);
  }

  showToast(msg) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
  }
  showLoading() {
    // this.loadingController = this.loadingCtrl.create({
    //   content: 'Loading'
    // });
    // this.loadingController.present();
    this.loading = true;
  }

  hideLoading() {
    // this.loadingController.dismiss();
    this.loading = false;
  }

  private showBio = false;
  toggleBio () {
    this.showBio = !this.showBio;
  }

  showProfileImage() {
    if (this.user.profile_image) {
      this.photoViewer.show(this.user.profile_image, this.user.getName(), {share: false})
    }
  }

  private savingBio: boolean = false;
  editBio() {
    if (this.isSelf) {
      let profileModal = this._modalCtrl.create(ModalTextInputPage, {
        text: this.user.bio,
        title: 'About you',
        placeholder: 'This should be a short bio about yourself, talk about who you are, your interests, great achievements, and anything you think overs will find interesting.'
      });
      profileModal.onDidDismiss(data => {
        if (data) {
          this.savingBio = true;
          this._userService.patch(this.user.id, {
            bio: data
          }).subscribe((res) => {
            this.savingBio = false;
            this.user.bio_html = res.bio_html;
          }, (err) => {
            this.savingBio = false;
            this.showToast(err);
          });
          this.user.bio = data;
        }
      });
      profileModal.present();
    }
  }

  getUser() {
    if (typeof this.userId === 'undefined') {
      this._userService.getCurrentUser().subscribe((res) => {
        this.isSelf = true;
        this.user = res;
        this.userId = this.user.id;
        this._analytics.logEvent('profile', 'navigated-to-my-profile', this.user.id);
        this.userLoaded();
      }, (err) => {
        this.hideLoading();
        this.showToast('An error occurred attempting to load your profile.');
      });
    } else {
      this._userService.get(this.userId).subscribe((res) => {
        this.user = res;
        this.userLoaded();
        this._analytics.logEvent('profile', 'navigated-to-profile', this.user.id);
      }, (err) => {
        this.hideLoading();
        this.showToast('An error occurred attempting to load the profile.');
      });
    }
  }

  getConnectionRequest() {
    if (this.user.pending_request) {
      this._connectionRequestService.get(this.user.pending_request).subscribe((res) => {
        this.connectionRequest = res;
      });
    }
  }

  getUsersPosts() {
    this._postService.getList({
      created_by_id: this.userId
    }).subscribe((res) => {
      this.postsLoading = false;
      this.usersPosts.push(...res.results);
      console.log(res);
    });
  }

  loadMorePosts($event: InfiniteScroll) {
    this._postService.getNextList().subscribe((res) => {
      if (res !== []) {
        this.usersPosts.push(...res.results);
      } {
        $event.enable(false);
      }
      $event.complete();
    });
  }

  getAuthoredLEs() {
    this._leService.getList({
      authors: this.userId
    }).subscribe((res) => {
      this.learningExperienceList = res.results;
      this.learningExperienceListLoading = false;
    }, (err) => {
      this.learningExperienceListLoading = false;
    });
  }

  userLoaded() {
    this.loading = false;
    this.hideLoading();
    this.getConnectionRequest();
    this.getAuthoredLEs();

    this._experienceService.getJobs({
      user_id: this.userId
    }).subscribe((res) => {
      this.jobExpereience = res.results;
      this.jobExpereienceLoading = false;
    });
    this._experienceService.getEducation({
      user_id: this.userId
    }).subscribe((res) => {
      this.educationalExpereience = res.results;
      this.educationalExpereienceLoading = false;
    });
    this.getUsersPosts();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  private imageModal;
  viewProfileImage() {
    if (typeof this.imageModal === 'undefined') {
      this.imageModal = this._modalCtrl.create(ImageViewPage, {
        imageSrc: this.user.profile_image
      });
      this.imageModal.onDidDismiss(data => {
        this.imageModal = undefined;
      });
      this.imageModal.present();
    }
  }

  private editModal;
  editProfile() {
    // if (typeof this.editModal === 'undefined') {
    //   this.editModal = this._modalCtrl.create(ProfileEditPage);
    //   this.editModal.onDidDismiss(data => {
    //     this.user = data;
    //     this.editModal = undefined;
    //   });
    //   this.editModal.present();
    // }
    this.rootNavCtrl.push(ProfileEditPage, {
      callback: (user) => {
        this.user = user;
      }
    });
  }

  public createRequest() {
    this._connectionRequestService.post({to_user_id: this.user.id}).subscribe((res) => {
      if (res.id) {
        this.connectionRequest = res;
        this.user.pending_request = res.id
      }
    });
  }

  public removeConnection() {
      let confirm = this.alertCtrl.create({
        title: 'Un-Connect?',
        message: 'Are you sure you want to remove your connection with ' + this.user.first_name + ' '+ this.user.last_name + '?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Un-Connect',
            handler: () => {
              // console.log('Agree clicked');
              this._connectionService.put('remove_with_userid', {
                to_user_id: this.user.id
              }).subscribe((res) => {
                this.user.connected = false;
              });
            }
          }
        ]
      });
      confirm.present();
  }

  public withdrawRequest(requestId: string) {
    this._connectionRequestService.withdrawRequest(requestId).subscribe((res) => {
      this.connectionRequest = null;
      this.user.pending_request = null;
    });
  }

  public acceptRequest(requestId: string) {
    this._connectionRequestService.acceptRequest(requestId).subscribe((res) => {
      this.connectionRequest = null;
      this.user.pending_request = null;
      this.user.connected = true;
    });
  }

  public rejectRequest(requestId: string) {
    this._connectionRequestService.rejectRequest(requestId).subscribe((res) => {
      this.connectionRequest = null;
      this.user.pending_request = null;
      this.user.connected = false;
    });
  }


  goToEducationList() {

  }

  goToJobList() {

  }

  goToPost(post: Post) {
    this.rootNavCtrl.push(PostDetailPage, {'post':post});

  }

  goToSettings(post: Post) {
    this.rootNavCtrl.push(SettingsPage);

  }

  panright($event) {
    this.rootNavCtrl.pop();
  }

  editExperience(type) {
    if (!type) {
      return false;
    }
    let title = type.charAt(0).toUpperCase() + type.slice(1);
    this.rootNavCtrl.push(ProfileExperienceEditPage, {
      type: type,
      title: title,
      callback: (res) => {
        console.log('callback', res);
        switch (type) {
          case 'education':
            this.educationalExpereience = res;
            break;
          case 'job':
            this.jobExpereience = res;
            break;
        }
      }
    });
  }

  goToLe(le) {
    this.rootNavCtrl.push(LearningExperienceOverviewPage, {
      le: le
    }, {
      animation: 'md-transition'
    });
  }


}
