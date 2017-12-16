import { Component, Input, OnDestroy } from '@angular/core';
import {
  Loading, LoadingController, NavController, NavParams,
  ToastController, ViewController
} from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  selector: 'page-modal-select',
  templateUrl: 'modal-select.html'
})
export class ModalSelectPage implements OnDestroy {


  public selectText = '';
  public searchCallback: Function = (text, cb) => {};
  public searchText: string = '';

  public allowCreateNew: boolean = false;
  public createNewCallback: Function = (text, cb) => {};

  public returnOnSelect: boolean = false;
  public emptyWhenNoSearch: boolean = false;

  public titleField = 'title';
  public items;
  public selected: any;

  private loading: boolean = true;
  private shouldShowCreateBtn: boolean = false;
  private loadingController: Loading;

  constructor(public statusBar: StatusBar,
              public _nav: NavController,
              public _navParams: NavParams,
              public _toast: ToastController,
              public _sessionService: SessionService,
              public _viewCtrl: ViewController,
              private _loadingCtrl: LoadingController
  ) {
    this.loading = false;

    let emptyWhenNoSearch = _navParams.get('emptyWhenNoSearch');
    if (emptyWhenNoSearch) this.emptyWhenNoSearch = emptyWhenNoSearch;
    let nscb = _navParams.get('searchCallback');
    if (nscb) {
      this.searchCallback = nscb;
      if (!this.emptyWhenNoSearch) {
        this.searchCallback('', (res) => {
          this.items = res;
        });
      }
    }
    let selectText = _navParams.get('selectText');
    if (selectText) this.selectText = selectText;
    let ntf = _navParams.get('titleField');
    if (ntf) this.titleField = ntf;
    let acn = _navParams.get('allowCreateNew');
    if (acn) this.allowCreateNew = acn;
    let cncb = _navParams.get('createNewCallback');
    if (cncb) this.createNewCallback = cncb;
    let ros = _navParams.get('returnOnSelect');
    if (ros) this.returnOnSelect = ros;
  }

  showLoading() {
    this.loadingController = this._loadingCtrl.create({
      content: 'Creating'
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  shouldShowCreate() {
    if (this.allowCreateNew === false) {
      return false;
    }
    let didMatch = false;
    for (let item of this.items) {
      let re = new RegExp('^' + this.searchText + '$', 'i');
      if (item[this.titleField].match(re)) {
        didMatch = true;
        break;
      }
    }
    return (!didMatch);
  }

  goBack() {
    this._viewCtrl.dismiss();
  }

  select(item) {
    this.selected = item;
    if (this.returnOnSelect) {
      this.choose();
    }
  }

  createNew() {
    this.shouldShowCreateBtn = false;
    this.selected = undefined;
    if (this.allowCreateNew) {
      if (this.searchText.length > 0) {
        this.showLoading();
        this.createNewCallback(this.searchText, (res) => {
          if (res) {
            this.selected = res;
            this.items = [res];
            this.shouldShowCreateBtn = this.shouldShowCreate();
          }
          this.hideLoading();
          if (this.returnOnSelect) {
            this.choose();
          }
        });
      }
    }
  }

  choose() {
    this._viewCtrl.dismiss(this.selected);
  }

  private debounceTimer;
  inputChanged($event) {
    this.shouldShowCreateBtn = false;
    this.loading = true;
    this.selected = undefined;
    this.searchText = $event;
    if (typeof this.debounceTimer !== 'undefined') {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = undefined;
    }

    if (typeof this.debounceTimer === 'undefined') {
      this.debounceTimer = setTimeout(() => {
        this.searchCallback($event, (res) => {
          this.loading = false;
          this.items = res;
          this.shouldShowCreateBtn = this.shouldShowCreate();
        });
      }, 500);
    }
  }

  onCancel($event) {
    this.inputChanged('');
  }

  ngOnDestroy() {
  }

}
