import { EventEmitter, Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ENV } from '../constant/env';

@Injectable()

export class AnalyticsService {

  private queue = [];
  private ready: boolean = false;
  private runningQueue: boolean = false;
  private selectedTab; // gets set in main tabs

  constructor(
    private _ga: GoogleAnalytics
  ) {
  }

  init() {
    this._ga.startTrackerWithId(ENV.ANALYTICS.GOOGLE.TRACKING_ID)
      .then(() => {
        this._ga.setAllowIDFACollection(true);
        this._ga.setAppVersion(ENV.APP_VERSION);
        this.debugLog('Google analytics', 'ready');
        this.ready = true;
        this.continueQueue();
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  setSelectedTab(value) {
    this.selectedTab = value;
  }

  getSelectedTab() {
    return this.selectedTab;
  }

  logScreenView(name: string) {
    this.queue.push(
      () => {
        if (name === undefined || name === null || name === '') {
          this.logException("Analytics", "No view name passed to logScreenView(name: string)");
        } else {
          this._ga.trackView(name);
          this.debugLog("logScreenView", name + ' ' + this.getSelectedTab());
          this.continueQueue();
        }
      }
    );
    this.continueQueue();
  }
  logException(fromWhere: String, message: string, fatal: boolean = false) {
    this.queue.push(
      () => {
        this._ga.trackException("" + fromWhere + " error: " + message, fatal);
        this.debugLog("logException", "" + fromWhere + " error: " + message);
        this.continueQueue();
      }
    );
    this.continueQueue();
  }

  logEvent(category: string, action: string, label: string = null, value: any = null, newSession: boolean = null) {
    this.queue.push(
      () => {
        this._ga.trackEvent(category, action, label, value, newSession);
        this.debugLog("logEvent", category + ' ' + action + ' ' + label + ' ' + value + ' ' + newSession);
        this.continueQueue();
      }
    );
    this.continueQueue();
  }

  debugLog(logginItem: String, data: any) {
      if (ENV.DEV_MODE) {
          console.log("Analytics: " + logginItem + " " + data);
      }
  }

  runNextQueuedItem() {
    if (this.queue.length > 0) {
      this.queue.shift()();
      this.continueQueue();
    }
  }

  continueQueue() {
    console.log('GA STATE: ready %s, queued: %s', this.ready, this.queue.length);
    if (this.ready) {
      if (this.queue.length > 0) {
        this.runningQueue = true;
        setTimeout(() => {
          this.runNextQueuedItem();
        }, 10)
      } else {
        this.runningQueue = false;
      }
    }
  }

}
