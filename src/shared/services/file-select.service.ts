import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileSelectService {

  constructor(
    private _toast: ToastController
  )  {


  }

  readImage(event: EventTarget) {

    return Observable.create((subscriber) => {
      let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
      let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
      let files: FileList = target.files;
      if (files.length > 0 ) {
        if(!files[0].type.includes('image')) {
          this.errorDisplay('The selected file is not an image.');
          subscriber.error('The selected file is not an image.');
          subscriber.complete();
        } else {
          let reader = new FileReader();
          reader.onload = this._handleReaderLoaded(files[0], (data) => {
            subscriber.next(data);
            subscriber.complete();
          }).bind(this);
          reader.readAsBinaryString(files[0]);
        }
      } else {
        subscriber.error('No file selected');
        subscriber.complete();
      }

      return () => {
        //cleanup
      };
    });
  }

  _handleReaderLoaded(file, callback) {
    return (readerEvt) => {
      callback({
        file: file,
        toString: () => btoa(readerEvt.target.result),
        toDataUri: () => 'data:' + file.type + ';base64,' + btoa(readerEvt.target.result),
        toBinary: () => readerEvt.target.result
      });
    }
  }


  errorDisplay(text, duration = 1500, position = 'top') {
    let toast = this._toast.create({
      message: text,
      duration: duration,
      position: position
    });
    toast.present();
  }

}
