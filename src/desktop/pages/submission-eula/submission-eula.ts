import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, ToastController, ViewController } from 'ionic-angular';



@Component({
  selector: 'page-submission-eula',
  templateUrl: 'submission-eula.html'
})
export class SubmissionEulaPage {

  private agreed: boolean = false;

  constructor(
    private viewCtrl: ViewController,
  ) {

  }


  dismiss(dismissType:string) {
    this.viewCtrl.dismiss(dismissType);
  }



}






