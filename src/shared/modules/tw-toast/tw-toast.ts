import { App, Config, NavOptions, ToastOptions, ViewController } from 'ionic-angular';
import { isPresent } from 'ionic-angular/util/util';
import { TWToastCmp } from './tw-toast-cmp';
import { ToastSlideIn, ToastSlideOut, ToastMdSlideIn, ToastMdSlideOut, ToastWpPopOut, ToastWpPopIn } from 'ionic-angular/components/toast/toast-transitions';
import { PORTAL_TOAST } from 'ionic-angular/components/app/app-constants';
/**
 * @hidden
 */

export class TWToast extends ViewController {
  private _app: App;

  constructor(app: App, opts: ToastOptions = {}, config: Config) {
    opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;
    super(TWToastCmp, opts, null);
    this._app = app;

    // set the position to the bottom if not provided
    if (!opts.position || !this.isValidPosition(opts.position)) {
      opts.position = TOAST_POSITION_BOTTOM;
    }

    this.isOverlay = true;

    config.setTransition('toast-slide-in', ToastSlideIn);
    config.setTransition('toast-slide-out', ToastSlideOut);
    config.setTransition('toast-md-slide-in', ToastMdSlideIn);
    config.setTransition('toast-md-slide-out', ToastMdSlideOut);
    config.setTransition('toast-wp-slide-out', ToastWpPopOut);
    config.setTransition('toast-wp-slide-in', ToastWpPopIn);
  }

  /**
   * @hidden
   */
  getTransitionName(direction: string): string {
    let key = 'toast' + (direction === 'back' ? 'Leave' : 'Enter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @hidden
   */
  isValidPosition(position: string): boolean {
    return position === TOAST_POSITION_TOP || position === TOAST_POSITION_MIDDLE || position === TOAST_POSITION_BOTTOM;
  }

  /**
   * @param {string} message  Toast message content
   */
  setMessage(message: string): TWToast {
    this.data.message = message;
    return this;
  }

  /**
   * @param {number} dur  Toast message duration
   */
  setDuration(dur: number): TWToast {
    this.data.duration = dur;
    return this;
  }

  /**
   * @param {'top'|'middle'|'bottom'} pos  Toast message position
   */
  setPosition(pos: 'top' | 'middle' | 'bottom'): TWToast {
    this.data.position = pos;
    return this;
  }

  /**
   * @param {string} cssClass  Toast message CSS class
   */
  setCssClass(cssClass: string): TWToast {
    this.data.cssClass = cssClass;
    return this;
  }

  /**
   * @param {boolean} closeButton  Toast message close button
   */
  setShowCloseButton(closeButton: boolean): TWToast {
    this.data.showCloseButton = closeButton;
    return this;
  }

  /**
   * Present the toast instance.
   *
   * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions: NavOptions = {}): Promise<any> {
    navOptions.disableApp = false;
    navOptions.keyboardClose = false;
    return this._app.present(this, navOptions, PORTAL_TOAST);
  }

  /**
   * Dismiss all toast components which have been presented.
   */
  dismissAll() {
    this._nav && this._nav.popAll();
  }

}

const TOAST_POSITION_TOP = 'top';
const TOAST_POSITION_MIDDLE = 'middle';
const TOAST_POSITION_BOTTOM = 'bottom';
