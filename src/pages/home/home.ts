import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { User } from '../../shared/models/User';
import { StatusBar } from '@ionic-native/status-bar';
import { twzColor } from '../../shared/utils/twz-color-util';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public user: User;

  constructor(
      public statusBar: StatusBar,
    public navCtrl: NavController,
    public _sessionService: SessionService
  ) {
    // this.statusBar.backgroundColorByHexString(twzColor.orangeDarkHex);

    if (typeof this._sessionService.user !== 'undefined') {
      this.user = this._sessionService.user;
    } else {
      this._sessionService.userObservable.subscribe((res) => {
        this.user = res;
      });
    }

  }

}
