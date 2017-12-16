import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform, ViewController, Item } from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-modal-text-input',
  templateUrl: 'modal-text-input.html'
})
export class ModalTextInputPage implements OnDestroy {

  @ViewChild('labelItem')
  public labelItem: Item;

  @ViewChild('textArea')
  public textArea: ElementRef;

  public text = '';
  public title = '';
  public placeholder = '';
  // private textAreaHeight = 100;
  public keyboardOpenListener;
  public keyboardCloseListener;
  public keyboardOpen: boolean = false;

  constructor(public statusBar: StatusBar,
              public _nav: NavController,
              public _viewCtrl: ViewController,
              public _navParams: NavParams,
              public _sessionService: SessionService,
              public _keyboard: Keyboard,
              public _platform: Platform,
  ) {

    if (this._platform.is('ios')) {
      this.keyboardOpenListener = this._keyboard.onKeyboardShow().subscribe((e: any) => {
        // console.log('keyboard showed');
        // console.log(e.keyboardHeight);
        this.inputResize(e.keyboardHeight);
        this.keyboardOpen = true;
      });

      this.keyboardCloseListener = this._keyboard.onKeyboardHide().subscribe((e: any) => {
        // console.log('keyboard hide');
        // console.log(e.keyboardHeight);
        this.inputResize();
        this.keyboardOpen = false;
      });
    }

    let text = this._navParams.get('text');
    if (text) {
      this.text = text;
    }
    let title = this._navParams.get('title');
    if (title) {
      this.title = title;
    }
    let placeholder = this._navParams.get('placeholder');
    if (placeholder) {
      this.placeholder = placeholder;
    }
    // this.textAreaHeight = window.innerHeight/ 2;
  }

  inputResize(keyboardHeight?:number) {
    // console.log('labelItem', this.labelItem);
    // console.log('textArea', this.textArea);
    if (this._platform.is('ios')) {
      if (keyboardHeight) {
        // console.log('set height to', 'calc( 98% - ' + this.labelItem._elementRef.nativeElement.scrollHeight + 'px' + ' - ' + keyboardHeight + 'px )');
        this.textArea.nativeElement.style.height = 'calc( 100% - 5px - ' + this.labelItem._elementRef.nativeElement.scrollHeight + 'px' + ' - ' + keyboardHeight + 'px )';
      } else {
        // console.log('set height to', 'calc( 98% - ' + this.labelItem._elementRef.nativeElement.scrollHeight + 'px' + ' )');
        this.textArea.nativeElement.style.height = 'calc( 100% - 5px - ' + this.labelItem._elementRef.nativeElement.scrollHeight + 'px' + ' )';
      }
    } else {
      this.textArea.nativeElement.style.height = 'calc( 100% - 5px )';
    }

  }

  ionViewDidEnter() {
    this.inputResize();
  }


  goBack() {
    this._viewCtrl.dismiss();
  }

  save() {
    this._viewCtrl.dismiss(this.text);
  }

  ngOnDestroy() {
    if (this._platform.is('ios')) {
      this.keyboardOpenListener.unsubscribe();
      this.keyboardCloseListener.unsubscribe();
    }
  }
}
