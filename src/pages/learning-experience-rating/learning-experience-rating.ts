import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { LearningExperience } from '../../shared/models/LearningExperience';
import { ReviewService } from '../../shared/services/review.service';
import { Review } from '../../shared/models/Review';
import { SessionService } from '../../shared/services/session.service';
import { UserService } from '../../shared/services/user.service';
import { MainTabs } from '../main-tabs/main-tabs';
import { AnalyticsService } from '../../shared/services/analytics.service';

/**
 * Generated class for the LearningExperienceRatingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-learning-experience-rating',
  templateUrl: 'learning-experience-rating.html',
})
export class LearningExperienceRatingPage {

  private reviewId: string;
  private loading: boolean = true;
  private submitting: boolean = false;
  private loadingController: Loading;
  // private myRating: number;
  // private myReview: string = "";
  private myReview: {review:string, rating:number} = {review:"", rating:null};
  private ratingQuestion: string = "Please rate this learning experience.";
  private reviewQuestion: string = "Please review this learning experience.";
  public le: LearningExperience;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public _reviewService: ReviewService,
              public _userService: UserService,
              private _loadingCtrl: LoadingController,
              private _analytics: AnalyticsService) {
    this.le = this.navParams.get('le');
    this.getMyReview();
  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
    this._analytics.logEvent('learning-experience', 'navigated-to-rate-le', this.le.id + ':' + this.le.title);
  }

  showLoading(loadingText:string = `Loading`) {
    this.loadingController = this._loadingCtrl.create({
      content: loadingText
    });
    this.loadingController.present();
    this.loading = true;
  }

  hideLoading() {
    this.loadingController.dismiss();
    this.loading = false;
  }

  getMyReview() {
    this.showLoading();
    this._userService.getCurrentUser().subscribe((res) => {
      this._reviewService.getList( {object_id: this.le.id, created_by:res.id} ).subscribe((res) => {
        if (res.length) {
          this.reviewId = res[0].id;
          for (let q of res[0].response) {
            if (q.question == this.reviewQuestion) {
              this.myReview.review = q.response;
            } else if (q.question == this.ratingQuestion) {
              this.myReview.rating = q.response;
            }
          }
        }
        this.hideLoading();
      }, (err) => {
        this.hideLoading();
      });
    });
  }

  setRating(rating: number) {
    if (rating >= 1 && rating <= 5) {
      this.myReview.rating = rating;
    } else {
      console.log(rating,' is a bad rating and not between 1 and 5');
    }
  }

  starIcon(index: number) {
    if (index <= this.myReview.rating) {
      return 'star';
    } else {
      return 'star-outline';
    }
  }

  presentAlert(title="Alert", message="Message to go here", button="OK") {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [button]
    });
    alert.present();
  }

  canSubmit() {
    return (this.myReview.rating >= 1 && this.myReview.rating <=5 && this.myReview.review.trim().length > 9 && !this.submitting);
  }

  submitReview(){

    if (!this.canSubmit()) {
      this.presentAlert("Cannot Submit", "You must select a star rating, and leave a review that is at least 10 characters long.", "Got It");
      return false;
    } else {
      let reviewObj = {
        object_id: this.le.id,
        content_type: 16,
        template: "5108767a-f8bf-45d1-997a-830f14ad7b03",
        response: [
          {
            question: this.ratingQuestion,
            type: "5stars",
            response: this.myReview.rating
          },
          {
            question: this.reviewQuestion,
            type: "text",
            response: this.myReview.review
          }
        ]
      };

      if (this.reviewId) {
        this.submitting = true;
        this.showLoading(`Updating Review`);
        this._reviewService.patch(this.reviewId, reviewObj).subscribe((res) => {
          this.reviewId = res.id;
          this.submitting = false;
          this.hideLoading();
          this.goToTabs();
        }, (err) => {
          this.submitting = false;
          this.hideLoading();
          console.log(err);
        });
      } else {
        this.submitting = true;
        this.showLoading(`Saving Review`);
        this._reviewService.post(reviewObj).subscribe((res) => {
          this.reviewId = res.id;
          this.submitting = false;
          this.hideLoading();
          this.goToTabs();
        }, (err) => {
          this.submitting = false;
          this.hideLoading();
          console.log(err);
        });
      }
    }


  }

  goToTabs(selectedTabIndex:number = 1){
    this.navCtrl.setRoot(MainTabs, {selectedTabIndex: selectedTabIndex});
  }

}
