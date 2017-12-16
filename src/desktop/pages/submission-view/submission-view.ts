import { Component } from '@angular/core';
import { LoadingController, NavController, ToastController, ModalController, NavParams, Loading } from 'ionic-angular';
import * as showdown from 'showdown';
import { SubmissionEulaPage } from '../submission-eula/submission-eula';
import { LESubmissionService } from '../../../shared/services/le-submission.service';
import { LESubmission, LESubmissionRating } from '../../../shared/models/LESubmission';
import { Observable } from 'rxjs/Observable';
import { LESubmissionRatingService } from '../../../shared/services/le-submission-rating.service';
import { AuthenticatedComponent, OnAuthenticated } from '../../../shared/bases/components/authenticated.component';
import { SessionService } from '../../../shared/services/session.service';
import { SubmissionRatingsListPage } from '../submission-ratings-list/submission-ratings-list';
import { SubmissionCreatePage } from '../submission-create/submission-create';
const converter = new showdown.Converter(
  {
    tables: true
  }
);



@Component({
  selector: 'page-submission-view',
  templateUrl: 'submission-view.html'
})
export class SubmissionViewPage extends AuthenticatedComponent implements OnAuthenticated {

  public leSubmissionId;
  public leSubmission: LESubmission = new LESubmission({});
  public contentSection: string = "original";
  public markdownPreview: string;
  public convertingToMarkdown: boolean = false;
  private loadingController: Loading;
  private loading: boolean = true;
  private submittingRating: boolean = false;
  private showdownOptions;
  private ratingMetrics: any = {};
  private ratingMetricsList: any[] = [];
  private leSubmissionRating: LESubmissionRating = new LESubmissionRating({});
  private isThisMine: boolean = false;
  private haveIRatedThis: boolean = false;
  private myRatingOfThis: LESubmissionRating;
  private ratingsModal;
  private callbackMethod = (something) => {};

  constructor(
    public _nav: NavController,
    public _sessionService: SessionService,
    private _navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _modalCtrl: ModalController,
    private _leSubmissionRatingService: LESubmissionRatingService,
    private _leSubmissionService: LESubmissionService
  ) {
    super(_nav, _sessionService);
  }

  resetComponent() {
    this.leSubmissionId = undefined;
    this.leSubmission = new LESubmission({});
    this.contentSection = "original";
    this.markdownPreview = undefined;
    this.convertingToMarkdown = false;
    this.loadingController = undefined;
    this.loading = true;
    this.submittingRating = false;
    this.showdownOptions = undefined;
    this.ratingMetrics = {};
    this.ratingMetricsList = [];
    this.leSubmissionRating = new LESubmissionRating({});
    this.isThisMine = false;
    this.haveIRatedThis = false;
    this.myRatingOfThis = undefined;
  }

  OnAuthenticated() {
    this.leSubmissionId = this._navParams.get('leSubmissionId');
    let callbackMethod = this._navParams.get('callbackMethod');
    if (callbackMethod) {
      this.callbackMethod = callbackMethod;
    }
    if (this.leSubmissionId) {
      this.leSubmissionRating.le_submission = this.leSubmissionId;
      this.getLeSubmission();
    }
  }

  showLoading() {
    this.loadingController = this.loadingCtrl.create({
      content: `Saving`
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  getLeSubmission() {
    this._leSubmissionService.get(this.leSubmissionId).subscribe((res) => {
      this.leSubmission = res;
      this.updateMarkdown();
      if (this.leSubmission.created_by_id === this.user.id) {
        this.isThisMine = true;
        this.buildMetricsFromResponse();
        this.loading = false;
      } else {
        this.getLeSubmissionRatingMetrics();
        for (let rating of this.leSubmission.ratings) {
          if (rating.created_by_id === this.user.id) {
            this.haveIRatedThis = true;
            this.myRatingOfThis = rating;
          }
        }
      }
    });
  }

  makeNewVersionOfLeSubmission() {
    this.loading = true;
    this.showLoading();
    this._leSubmissionService.makeNewVersion(this.leSubmissionId).subscribe((res) => {
      this.hideLoading();
      this._nav.pop();
      this.callbackMethod(() => {
        this._nav.push(SubmissionCreatePage, {
          leSubmissionId: res.id
        });
      });
    }, (err) => {
      this.hideLoading();
      this.loading = false;
    });
  }

  buildMetricsFromResponse() {
    // this is used to get the current metrics in the ratings for the LE
    if (this.leSubmission.ratings.length > 0) {
      for (let item in this.leSubmission.ratings[0].ratings) {
        this.ratingMetricsList.push({
          metric: item
        });
      }
    }

  }

  getLeSubmissionRatingMetrics() {
    this._leSubmissionRatingService.getMetrics().subscribe((res) => {
      this.ratingMetrics = res;
      for (let field in res) {
        this.leSubmissionRating.ratings[field] = "";
        this.ratingMetricsList.push({
          metric: field
        });
      }
      this.loading = false;
    });
  }

  updateMarkdown($event?) {
    this.convertingToMarkdown = true;
    this.markdownPreview = converter.makeHtml(this.leSubmission.markdown);
    this.convertingToMarkdown = false;
  }

  checkForAllSixes() {
    let allSixes = true;
    for (let field in this.leSubmissionRating.ratings) {
      if (this.leSubmissionRating.ratings.hasOwnProperty(field)) {
        if (parseInt(this.leSubmissionRating.ratings[field]) < 6) {
          allSixes = false;
          return false;
        }
      }
    }

    if (allSixes) {
      this.leSubmissionRating.approved = true;
    }

  }

  updateRating($event, metric) {
    this.leSubmissionRating.ratings[metric] = parseInt($event);
    this.checkForAllSixes();
  }

  submitRating() {
    this.submittingRating = true;
    this.showLoading();
    this._leSubmissionRatingService.post(JSON.stringify(this.leSubmissionRating)).subscribe((res) => {
      this.leSubmissionRating = res;
      this.hideLoading();
      this.resetComponent();
      this.OnAuthenticated();
    }, (err) => {
      this.submittingRating = false;
      this.hideLoading();
    });
  }

  canSubmitRating() {
    for (let item of this.ratingMetricsList) {
      if (this.leSubmissionRating.ratings[item.metric] === "") {
       return false;
      }
    }

    return true;

  }

  showRatingsModal() {
    this.ratingsModal = this._modalCtrl.create(SubmissionRatingsListPage, {
      ratings: this.leSubmission.ratings,
      metricsList: this.ratingMetricsList
    }, {
      cssClass: ' modal-fullscreen '
    });

    this.ratingsModal.present();


  }


}






