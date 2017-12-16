import { AfterViewInit, Component, ElementRef, Renderer } from '@angular/core';
import { Config, NavParams, ViewController } from 'ionic-angular';



/**
 * @hidden
 */
@Component({
  selector: 'tw-toast',

  template:
  '<div class="toast-wrapper" (panright)="panright($event)"' +
  '[class.toast-bottom]="d.position === \'bottom\'" ' +
  '[class.toast-middle]="d.position === \'middle\'" ' +
  '[class.toast-top]="d.position === \'top\'"> ' +
  '<div class="toast-container"> ' +
  '<div class="toast-image" *ngIf="d.image"><img ToastImage [imageSrc]="d.image" [resize]="\'100x100\'" style="object-fit: cover;" /></div> ' +
  '<div class="toast-message" id="{{hdrId}}" *ngIf="d.message" [innerHTML]="d.message"></div> ' +
  '<button ion-button clear class="toast-button" *ngIf="d.showCloseButton" (click)="cbClick()"> ' +
  '{{ d.closeButtonText || \'Close\' }} ' +
  '</button> ' +
  '</div> ' +
  '</div>',
  host: {
    'role': 'dialog',
    '[attr.aria-labelledby]': 'hdrId',
    '[attr.aria-describedby]': 'descId',
  },
})
export class TWToastCmp implements AfterViewInit {
  d: {
    image?: string;
    message?: string;
    cssClass?: string;
    duration?: number;
    showCloseButton?: boolean;
    closeButtonText?: string;
    clickCallBack?: Function;
    dismissOnPageChange?: boolean;
    position?: string;
  };
  descId: string;
  dismissTimeout: number = undefined;
  enabled: boolean;
  hdrId: string;
  id: number;

  private onClickCallbackListener;

  constructor(
    public _viewCtrl: ViewController,
    public _config: Config,
    public _elementRef: ElementRef,
    params: NavParams,
    private renderer: Renderer
  ) {
    renderer.setElementClass(_elementRef.nativeElement, `toast-${_config.get('mode')}`, true);
    this.d = params.data;

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        // Make sure the class isn't whitespace, otherwise it throws exceptions
        if (cssClass.trim() !== '') renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++toastIds);
    if (this.d.message) {
      this.hdrId = 'toast-hdr-' + this.id;
    }
  }

  ngAfterViewInit() {
    // if there's a `duration` set, automatically dismiss.
    if (this.d.duration) {
      this.dismissTimeout = (<any>setTimeout(() => {
        this.dismiss('backdrop');
      }, this.d.duration));
    }
    if (this.d.clickCallBack) {
      this.onClickCallbackListener = this.renderer.listen(this._elementRef.nativeElement, 'tap', (event) => {
        this.d.clickCallBack(event);
        if (this.dismissTimeout) {
          this.dismiss('close');
        }
      });
    }
    this.enabled = true;
  }

  ionViewDidEnter() {
    const { activeElement }: any = document;
    if (activeElement) {
      activeElement.blur();
    }

    let focusableEle = this._elementRef.nativeElement.querySelector('button');

    if (focusableEle) {
      focusableEle.focus();
    }
  }

  panright($event) {
    if (this.dismissTimeout) {
      this.dismiss('close');
    }
  }

  dismiss(role: string): Promise<any> {
    clearTimeout(this.dismissTimeout);
    this.dismissTimeout = undefined;
    if (this._viewCtrl._nav) {
      return this._viewCtrl.dismiss(null, role, {
        disableApp: false
      });
    }
  }

  ngOnDestroy() {
    if (this.d.clickCallBack) {
      if (this.onClickCallbackListener) {
        this.onClickCallbackListener();
      }
    }
  }

}

let toastIds = -1;