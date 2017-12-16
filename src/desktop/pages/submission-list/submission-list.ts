import { Component, OnInit } from '@angular/core';
import { ListResponse } from '../../../shared/bases/models/ListResponse';
import { LESubmissionService } from '../../../shared/services/le-submission.service';
import {
  AlertController, Loading, LoadingController, ModalController, Nav, NavController,
  ToastController
} from 'ionic-angular';
import { SubmissionCreatePage } from '../submission-create/submission-create';
import { SubmissionViewPage } from '../submission-view/submission-view';
import { SubmissionEulaPage } from '../submission-eula/submission-eula';
import { Observable } from 'rxjs/Observable';
import { AuthenticatedComponent, OnAuthenticated } from '../../../shared/bases/components/authenticated.component';
import { SessionService } from '../../../shared/services/session.service';
import { LESubmission } from '../../../shared/models/LESubmission';



@Component({
  selector: 'page-submission-list',
  templateUrl: 'submission-list.html'
})
export class SubmissionListPage extends AuthenticatedComponent implements OnAuthenticated {


  leSubmissionsResponse: ListResponse;

  private loading = true;
  private loadingController: Loading;
  private eulaModal;

  constructor(
    public _nav: NavController,
    public _sessionService: SessionService,
    private _navNav: Nav,
    private _leSubmissionService: LESubmissionService,
    private _loadingCtrl: LoadingController,
    private _toastCtrl: ToastController,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController
  ) {
    super(_nav, _sessionService);
  }

  showToast(msg, duration=4000) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: duration,
      position: 'top'
    });
    toast.present();
  }

  OnAuthenticated() {
    this.getLeSubmissions();
  }
  ionViewDidEnter() {
    if (this.user) {
      this.getLeSubmissions();
    }
  }

  getLeSubmissions() {
    this._leSubmissionService.getList({
      limit: 100
    }).subscribe((res) => {
      this.leSubmissionsResponse = res;
      this.loading = false;
    });
  }

  viewLeSubmission(item) {
    this._navNav.push(SubmissionViewPage, {
      leSubmissionId: item.id,
      callbackMethod: this.runCallback
    });
  }

  runCallback(func) {
    func();
  }

  editLeSubmission(item) {
    this._navNav.push(SubmissionCreatePage, {
      leSubmissionId: item.id
    });
  }


  showLoading() {
    this.loadingController = this._loadingCtrl.create({
      content: `Saving`
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  preSubmit() {
    this.eulaModal = this._modalCtrl.create(SubmissionEulaPage, {});

    return Observable.create((subscriber) => {
      this.eulaModal.present();
      this.eulaModal.onDidDismiss(data => {
        if (data == "accepted") {
          subscriber.next(data);
          subscriber.complete();
        } else {
          subscriber.error(data);
          subscriber.complete();
        }
      });

      return () => {
        //cleanup
      };
    });
  }

  submitForReview(leSubmission) {
    this.preSubmit().subscribe((agree) => {
      if (typeof agree !== 'undefined') {
        this.showLoading();
        if (agree === 'accepted') {
          this._leSubmissionService.submit(leSubmission.id, JSON.stringify(leSubmission)).subscribe((resFromSubmit) => {
            this.showToast('Learning Experience Submission Submitted');
            this.hideLoading();
          }, (err) => {
            this.showToast('There was an error submitting the Learning Experience Submission');
            console.log('error saving LE Submission', err);
            this.hideLoading();
          });
        }
      }
    }, (err) => {
      this.hideLoading();
    });
  }

  confirmDelete(leSubmission: LESubmission) {
    let alert = this._alertCtrl.create({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete the LE Submission: ' + leSubmission.title + '?',
      buttons: [
        {
          text: 'Nope',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.delete(leSubmission);
          }
        }
      ]
    });
    alert.present();
  }


  delete(leSubmission) {
    this.showLoading();
    this._leSubmissionService.delete(leSubmission.id).subscribe((resFromSubmit) => {
      this.showToast('Learning Experience Submission Deleted');
      for (let index in this.leSubmissionsResponse.results) {
        if ( this.leSubmissionsResponse.results[index].id === leSubmission.id) {
          this.leSubmissionsResponse.results.splice(parseInt(index), 1);
          this.hideLoading();
          return;
        }
      }
      this.hideLoading();
    }, (err) => {
      this.showToast('There was an error deleting the Learning Experience Submission');
      console.log('error deleting LE Submission', err);
      this.hideLoading();
    });
  }


}
