import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response, URLSearchParams } from '@angular/http';
import { ListResponse } from '../bases/models/ListResponse';
import { HttpSettingsService } from './HttpSettingsService';
import { BaseService } from '../bases/services/BaseService';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class PhoneVerificationService extends BaseService {

  public _basePath = 'users/';

  constructor(
    public http: Http,
    public _alertCtrl: AlertController,
    public _httpSettings: HttpSettingsService
  ) {
    super(http, _httpSettings);
  }

  listMap(res: Response): ListResponse {
    let toReturn = <ListResponse>res.json();
    for (let num in toReturn.results) {
      if (toReturn.results.hasOwnProperty(num)) {
        toReturn.results[num] = toReturn.results[num];
      }
    }
    return toReturn;
  }

  singleMap(res: Response): {detail: string} {
    return res.json();
  }

  presentVerifyNumber(): Observable<{detail:string, canceled?: boolean}> {
    return Observable.create((subscriber) => {
      let alert = this._alertCtrl.create({
        title: 'Verify your number',
        message: 'You will receive a code at the number you provided if you press continue.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              subscriber.error({detail:'Canceled', canceled: true});
              subscriber.complete();
            }
          },
          {
            text: 'Continue',
            handler: () => {
              this.sendVerification().subscribe((res) => {
                this.askForCode().subscribe(res => {
                  subscriber.next(res);
                  subscriber.complete(res);
                }, (err) => {
                  subscriber.error(err);
                  subscriber.complete();
                });
              }, (err) => {
                subscriber.error(err);
                subscriber.complete();
              });
            }
          }
        ]
      });
      alert.present();
      return () => {
        //cleanup
      };

    });

  }

  presentChangeNumber(): Observable<{detail:string, canceled?: boolean}> {
    return Observable.create((subscriber) => {

      this.confirmActionOfChangeNumber().subscribe((res) => {

      }, (err) => {
        subscriber.error({detail:'Canceled', canceled: true});
        subscriber.complete();
      });
      return () => {
        //cleanup
      };

    });

  }

  private confirmActionOfChangeNumber(): Observable<{detail:string, canceled?: boolean}> {
    return Observable.create((subscriber) => {
      let alert = this._alertCtrl.create({
        title: 'Change your number',
        message: 'Would you like to update your phone number?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              subscriber.error({detail:'Canceled', canceled: true});
              subscriber.complete();
            }
          },
          {
            text: 'Continue',
            handler: () => {
              subscriber.next({detail:'Continue'});
              subscriber.complete();
            }
          }
        ]
      });
      alert.present();
      return () => {
        //cleanup
      };

    });

  }

  private showAlert(title, msg, cb = () => {}) {
    let alert = this._alertCtrl.create({
      title: title,
      message: msg,
      buttons: [
        {
          text: 'Ok',
          handler: (data) => {
            cb();
          }
        }
      ]
    });
    return alert.present();
  }

  private verifyphone(params?): Observable<{detail:string, canceled?: boolean}> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.post(this.getUrl() + 'verifyphone/', '', options)
      .map(res => {
        let toReturn = <any>this.singleMap(res);
        this.singleObject = toReturn;
        this.singleO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

  private verifyphonecode(code='', params?): Observable<{detail:string, canceled?: boolean}> {
    params = this._httpSettings.addTokenToParams(params);
    let options: RequestOptionsArgs = {
      headers: this._httpSettings.getHeaders(),
      search: new URLSearchParams(this.makeStringOfParams(params))
    };
    return this.http.post(this.getUrl() + 'verifyphonecode/', {
        code: code
      }, options)
      .map(res => {
        let toReturn = <any>this.singleMap(res);
        this.singleObject = toReturn;
        this.singleO.emit(toReturn);
        return toReturn;
      })
      .catch(this.handleError);
  }

  private sendVerification(): Observable<{detail:string, canceled?: boolean}> {
    return Observable.create((subscriber) => {
      this.verifyphone().subscribe((res) => {
        subscriber.next(res);
        subscriber.complete(res);
      }, (err) => {
        this.showAlert('An error occurred', err);
      });

      return () => {
        //cleanup
      };

    });
  }

  private askForCode(): Observable<{detail:string, canceled?: boolean}> {
    return Observable.create((subscriber) => {
      let alert2 = this._alertCtrl.create({
        title: 'Verify your number',
        message: 'Enter the text verification code',
        inputs: [
          {
            name: 'code',
            placeholder: '',
            type: 'tel'
          }],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              subscriber.error({detail:'Canceled', canceled: true});
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ok',
            handler: (data) => {
              if (data && data.hasOwnProperty('code')) {
                this.verifyphonecode(data['code']).subscribe((res) => {
                  subscriber.next(res);
                  subscriber.complete(res);
                }, (err) => {
                  this.prompTryAgain().subscribe((res2) => {
                    subscriber.next(res2);
                    subscriber.complete(res2);
                  }, (err2) => {
                    subscriber.error(err2);
                    subscriber.complete(err2);
                  });
                });
              } else {
                subscriber.error({detail:'no code supplied'});
              }
            }
          }
        ]
      });
      alert2.present();
      return () => {
        //cleanup
      };
    });
  }

  private prompTryAgain(): Observable<{detail:string, canceled?: boolean}> {
    return Observable.create((subscriber) => {
      let alert2 = this._alertCtrl.create({
        title: 'Verify your number',
        message: 'Please try again, enter the text verification code',
        inputs: [
          {
            name: 'code',
            placeholder: '',
            type: 'tel'
          }],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              subscriber.error({detail:'Canceled', canceled: true});
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ok',
            handler: (data) => {
              if (data && data.hasOwnProperty('code')) {
                this.verifyphonecode(data['code']).subscribe((res) => {
                  subscriber.next(res);
                  subscriber.complete(res);
                }, (err) => {
                  subscriber.error(err);
                  subscriber.complete();
                });
              } else {
                subscriber.error({detail:'no code supplied'});
              }
            }
          }
        ]
      });
      alert2.present();
      return () => {
        //cleanup
      };
    });
  }




}


