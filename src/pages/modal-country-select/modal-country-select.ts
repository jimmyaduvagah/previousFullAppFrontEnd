import { Component, Input, OnDestroy } from '@angular/core';
import {
  Loading, LoadingController, NavController, NavParams,
  ToastController, ViewController
} from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';
import { PhoneNumberProvider } from '../../shared/services/PhoneNumberService';

@Component({
  selector: 'page-modal-country-select',
  templateUrl: 'modal-country-select.html'
})
export class ModalCountrySelectPage implements OnDestroy {


  public searchText: string = '';

  public items;
  public selected: any;


  constructor(public statusBar: StatusBar,
              public _nav: NavController,
              public _navParams: NavParams,
              public _toast: ToastController,
              public _sessionService: SessionService,
              public phonenumber: PhoneNumberProvider,
              public _viewCtrl: ViewController,
  ) {
    this.items = this.phonenumber.countries;
  }

  goBack() {
    this._viewCtrl.dismiss();
  }

  select(item) {
    this.selected = item;
    this._viewCtrl.dismiss(this.selected);
  }

  inputChanged($event) {
    this.selected = undefined;
    this.searchText = $event;
    let regex = new RegExp($event, 'i');
    this.items = this.phonenumber.countries.filter((country) => regex.test(country.name));
  }

  onCancel($event) {
    this.inputChanged('');
  }

  ngOnDestroy() {
  }

}
