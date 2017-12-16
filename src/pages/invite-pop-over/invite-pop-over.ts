import {Component} from "@angular/core";
import {AlertController, ToastController, ViewController, NavParams, NavController} from 'ionic-angular';
import {UserInvitationCodeService} from "../../shared/services/invitation.service";

@Component({
  template: `
    <ion-list>
      <ion-list-header></ion-list-header>
      <ion-list *ngIf="choice" radio-group>
        <ion-item>
          <ion-label>Email Invitation</ion-label>
          <ion-radio (ionSelect)="onSelectChange($event)" value="email" ></ion-radio>
        </ion-item>       
        <ion-item>
          <ion-label>SMS Invitation</ion-label>
          <ion-radio (ionSelect)="onSelectChange($event)" value="phone" ></ion-radio>
        </ion-item>
      </ion-list>
      <ion-item *ngIf="email_choice">
        <ion-label color="primary"></ion-label>
        <ion-input type="text" [(ngModel)]="email_address" placeholder="Enter Email Address"></ion-input>
      </ion-item>
      <ion-item *ngIf="phone_choice">
        <ion-label color="primary"></ion-label>
        <ion-input type="text" [(ngModel)]="phone_number" placeholder="Enter Phone Number"></ion-input>
      </ion-item>
      <ion-item *ngIf="!choice">
        <button ion-button block clear (tap)="invite()">Invite</button>
      </ion-item>
    </ion-list>
  `
})
export class InvitePopoverPage {

  private choice: boolean = true;
  private email_address: string = '';
  private phone_number: string = '';
  private to_send: any = <any>{};
  private email_choice: boolean = false;
  private phone_choice: boolean = false;


  constructor(public viewCtrl: ViewController,
              private _toastCtrl: ToastController,
              private _alertCtrl: AlertController,
              private _navParams: NavParams,
              private  _nav: NavController,
              private _invitationCodeService: UserInvitationCodeService) {

  }

  invite() {
    if(this.phone_number) {
      console.log(this.phone_number);
      this.to_send = {'phone': this.phone_number};
    }
    if(this.email_address) {
      console.log(this.email_address);
      this.to_send = {'email': this.email_address};
    }
    this._invitationCodeService.post(this.to_send).subscribe((res) => {
      console.log(res);
    }, (err) => {
      console.log(err);
    });
    this.close();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  onSelectChange(selectedValue: any) {
    if(selectedValue == 'phone') {
      this.choice = false;
      this.phone_choice = true;
    }
    if(selectedValue == 'email') {
       this.choice = false;
       this.email_choice = true;
    }
  }

}
