import { Injectable } from '@angular/core';
import { Deploy } from "@ionic/cloud-angular";
import { ToastController } from "ionic-angular";
import { Observable } from "rxjs/Observable";


@Injectable()
export class AppUpdateService {


  constructor(public _deploy: Deploy,
              private _toastCtrl: ToastController,) {
  }

  checkForNewVersion() {
    return Observable.create(observer => {
      this._deploy.check().then((snapshotAvailable: boolean) => {
        observer.next(snapshotAvailable);
        observer.complete();
      });
      return () => {
        //cleanup
      };
    });

  }


}
