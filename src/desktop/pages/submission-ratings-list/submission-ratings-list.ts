import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { LESubmissionRating } from '../../../shared/models/LESubmission';



@Component({
  selector: 'page-submission-ratings-list',
  templateUrl: 'submission-ratings-list.html'
})
export class SubmissionRatingsListPage implements OnInit {

  ratings: LESubmissionRating[] = [];
  metricsList = [];

  constructor(
    private viewCtrl: ViewController,
    private _navParams: NavParams
  ) {

  }

  ngOnInit() {
    this.ratings = this._navParams.get('ratings');
    this.metricsList = this._navParams.get('metricsList');

  }


  dismiss() {
    this.viewCtrl.dismiss();
  }



}






