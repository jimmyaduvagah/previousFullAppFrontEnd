import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';


@Injectable()
export class StorageService {

  tables = {};

  constructor(private _storage: Storage) {
  }

  set(key, data) {
    this._storage.set(key, data);
  }

  get(key) {
    return this._storage.get(key);
  }

  storeImage(url, base64Data) {
    this._storage.set('imageCache-'+url, base64Data);
  }

  getImage(url) {
    return this._storage.get('imageCache-'+url);
  }

  countImageCache() {
    return Observable.create((subscriber) => {

      let count = 0;
      let totalBytes = 0;
      this._storage.forEach((value, key, iterationNumber) => {
        if (key.match(/^imageCache/)) {
          count++;
          totalBytes = totalBytes + value.length;
        }
      }).then(() => {
        subscriber.next({
          count: count,
          totalBytes: totalBytes
        });
        subscriber.complete({
          count: count,
          totalBytes: totalBytes
        });
      });

      return () => {
        //cleanup
      };
    });
  }

  clearImageCache() {

    return Observable.create((subscriber) => {
      let count = 0;
      this._storage.forEach((value, key, iterationNumber) => {
        if (key.match(/^imageCache/)) {
          count++;
          this._storage.remove(key);
        }
      }).then(() => {
        subscriber.next({
        });
        subscriber.complete({
        });
      });
      return () => {
        //cleanup
      };

    });
  }


}
