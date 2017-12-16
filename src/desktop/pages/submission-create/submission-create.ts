import { ApplicationRef, Component, ViewChild } from '@angular/core';
import { LoadingController, NavController, ToastController, ModalController, NavParams, Loading } from 'ionic-angular';
import * as showdown from 'showdown';
import { SubmissionEulaPage } from '../submission-eula/submission-eula';
import { LESubmissionService } from '../../../shared/services/le-submission.service';
import { LESubmission } from '../../../shared/models/LESubmission';
import { Observable } from 'rxjs/Observable';
import { AuthenticatedComponent, OnAuthenticated } from '../../../shared/bases/components/authenticated.component';
import { SessionService } from '../../../shared/services/session.service';
import { FileSelectService } from '../../../shared/services/file-select.service';
import { LearningExperienceImageService } from '../../../shared/services/learning-experience-image.service';
import { SubmissionRatingsListPage } from '../submission-ratings-list/submission-ratings-list';
const converter = new showdown.Converter(
  {
    tables: true
  }
);

@Component({
  selector: 'page-submission-create',
  templateUrl: 'submission-create.html'
})
export class SubmissionCreatePage extends AuthenticatedComponent implements OnAuthenticated {

  @ViewChild('contentInput')
  contentInput: any;

  public leSubmissionId;
  public leSubmission: LESubmission = new LESubmission({});
  public contentSection: string = "original";
  public markdownPreview: string;
  public convertingToMarkdown: boolean = false;
  private loadingController: Loading;
  private loading: boolean = true;
  private showdownOptions;
  private selectionStart;
  private selectionEnd;
  private previewCoverImage: string;
  private loadingImage: boolean = false;
  private lockSave: boolean = false;
  private lockSubmitForReview: boolean = false;
  private ratingsModal;
  private ratingMetricsList = [];

  constructor(public _nav: NavController,
              public _sessionService: SessionService,
              private _navParams: NavParams,
              private loadingCtrl: LoadingController,
              private _toastCtrl: ToastController,
              private _modalCtrl: ModalController,
              private _applicationRef: ApplicationRef,
              private _leSubmissionService: LESubmissionService,
              private _learningExperienceImageService: LearningExperienceImageService,
              private _fileSelectService: FileSelectService) {
    super(_nav, _sessionService);
  }

  OnAuthenticated() {
    this.leSubmissionId = this._navParams.get('leSubmissionId');
    if (this.leSubmissionId) {
      this.getLeSubmission();
    } else {
      this.loading = false;
    }

  }

  showToast(msg, duration = 4000) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: duration,
      position: 'top'
    });
    toast.present();
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
      this.contentSection = 'preview';
      this.markdownConversion();
      this.loading = false;
    });
  }

  chooseImage($event) {
    this._fileSelectService.readImage($event).subscribe((fileContainer) => {
      this.showLoading();
      this.loadingImage = true;
      this.previewCoverImage = fileContainer.toDataUri();
      this._learningExperienceImageService.upload64Image({image: this.previewCoverImage}).subscribe((res) => {
        this.previewCoverImage = undefined;
        this.leSubmission.image = res;
        this.leSubmission.image_id = res.id;
        this.loadingImage = false;
        this.showToast("Be sure to save your LE Submission or else the image wont save with it!", 8000);
        this.hideLoading();
      }, (error) => {
        console.log(error);
        this.hideLoading();
      });
    });
  }

  preSubmit() {
    let eulaModal = this._modalCtrl.create(SubmissionEulaPage, {});

    return Observable.create((subscriber) => {
      eulaModal.present();
      eulaModal.onDidDismiss(data => {
        console.log(data);
        if (data == "accepted") {
          subscriber.next(data);
        } else {
          subscriber.error(data);
        }
      });

      return () => {
        //cleanup
      };
    });

  }

  save() {
    this.saveMethod().subscribe((res) => {
    }, (error) => {
    });
  }

  saveMethod(hideLoading: boolean = true) {
    this.lockSave = true;
    return Observable.create((subscriber) => {

      if (typeof this.leSubmission.id === 'undefined') {
        this.showLoading();
        this._leSubmissionService.post(JSON.stringify(this.leSubmission)).subscribe((res) => {
          this.leSubmission = res;
          if (hideLoading) {
            this.hideLoading();
          }
          this.showToast('Learning Experience Submission saved.');
          this.lockSave = false;
          subscriber.next(res);
          subscriber.complete();
        }, (err) => {
          this.showToast('There was an error saving the Learning Experience Submission');
          console.log('error saving LE Submission', err);
          if (hideLoading) {
            this.hideLoading();
          }
          this.lockSave = false;
          subscriber.error(err);
          subscriber.complete();
        });
      } else {
        this.showLoading();
        this._leSubmissionService.put(this.leSubmission.id, JSON.stringify(this.leSubmission)).subscribe((res) => {
          this.leSubmission = res;
          if (hideLoading) {
            this.hideLoading();
          }
          this.showToast('Learning Experience Submission saved.');
          this.lockSave = false;
          subscriber.next(res);
          subscriber.complete();
        }, (err) => {
          this.showToast('There was an error saving the Learning Experience Submission');
          console.log('error saving LE Submission', err);
          if (hideLoading) {
            this.hideLoading();
          }
          this.lockSave = false;
          subscriber.error(err);
          subscriber.complete();
        });
      }

      return () => {
        //cleanup
      };
    });
  }

  submitForReview() {
    this.lockSubmitForReview = true;
    this.saveMethod(false).subscribe((resFromSave) => {
      this.preSubmit().subscribe((agree) => {
        if (agree === 'accepted') {
          this._leSubmissionService.submit(this.leSubmission.id, JSON.stringify(resFromSave)).subscribe((resFromSubmit) => {
            this.showToast('Learning Experience Submission Submitted');
            this.lockSubmitForReview = false;
            this.hideLoading();
          }, (err) => {
            this.showToast('There was an error submitting the Learning Experience Submission');
            console.log('error saving LE Submission', err);
            this.lockSubmitForReview = false;
            this.hideLoading();
          });
        }
      }, (err) => {
        this.lockSubmitForReview = false;
        this.hideLoading();
      });
    }, (err) => {
      this.lockSubmitForReview = false;
      this.hideLoading();
    });
  }

  showOriginal() {
    this.contentSection = "original";
    setTimeout(() => {
      this.contentInput._native.nativeElement.focus();
      this.contentInput._native.nativeElement.selectionStart = (this.selectionStart) ? this.selectionStart : 0;
      this.contentInput._native.nativeElement.selectionEnd = (this.selectionEnd) ? this.selectionEnd : 0;
      this.selectionEnd = null;
      this.selectionStart = null;
    }, 10);
  }

  showPreview() {
    this.selectionEnd = this.contentInput._native.nativeElement.selectionEnd;
    this.selectionStart = this.contentInput._native.nativeElement.selectionStart;
    this.contentSection = "preview";
    // this.markdownConversion();

  }

  markdownConversion() {
    this.convertingToMarkdown = true;
    this.markdownPreview = converter.makeHtml(this.leSubmission.markdown);
    this.convertingToMarkdown = false;
  }

  makeMarkDown() {
    this.convertingToMarkdown = true;
    return Observable.create((subscriber) => {
      this.markdownPreview = converter.makeHtml(this.leSubmission.markdown);
      subscriber.next(this.markdownPreview);
      this.convertingToMarkdown = false;
      subscriber.complete();

      return () => {
        //cleanup
      };
    });
  }

  buildMetricsFromResponseForVersion(versionIndex) {
    // this is used to get the current metrics in the ratings for the LE
    if (this.leSubmission.versions[versionIndex].ratings.length > 0) {
      for (let item in this.leSubmission.versions[versionIndex].ratings[0].ratings) {
        this.ratingMetricsList.push({
          metric: item
        });
      }
    }

  }

  showRatingsModalForVersion(versionIndex) {
    this.buildMetricsFromResponseForVersion(versionIndex);
    this.ratingsModal = this._modalCtrl.create(SubmissionRatingsListPage, {
      ratings: this.leSubmission.versions[versionIndex].ratings,
      metricsList: this.ratingMetricsList
    }, {
      cssClass: ' modal-fullscreen '
    });

    this.ratingsModal.present();


  }


}






