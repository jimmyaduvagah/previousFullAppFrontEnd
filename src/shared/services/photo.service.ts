import { Injectable } from '@angular/core';
import { ActionSheet, ActionSheetController, Platform, ToastController } from 'ionic-angular';
import { SettingsService } from './SettingsService';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

@Injectable()
export class PhotoService {

  private defaultOptions: CameraOptions;

  constructor(private _platform: Platform,
              private _actionSheetController: ActionSheetController,
              private _settingsService: SettingsService,
              private file: File,
              private _toast: ToastController,
              private _camera: Camera) {
    this.defaultOptions = {
      quality: 100,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      targetWidth: 2400,
      allowEdit: false,
      targetHeight: 2400,
      saveToPhotoAlbum: this._settingsService.getUserSetting('savePictureToCameraRoll'),
      correctOrientation: true
    };

  }

  // TODO: implement later because only in iOS
  getLastPhotoTaken() {
  }

  getFromCamera(extraOptions?):Promise<any> {
    let options: CameraOptions = this.defaultOptions;
    options.sourceType = this._camera.PictureSourceType.CAMERA;
    if (typeof extraOptions !== 'undefined') {
      for (let field of extraOptions) {
        options[field] = extraOptions;
      }
    }
    return this._camera.getPicture(options);
  }

  getFromLibrary(extraOptions?):Promise<any> {
    let options: CameraOptions = this.defaultOptions;
    options.saveToPhotoAlbum = false;
    options.sourceType = this._camera.PictureSourceType.PHOTOLIBRARY;
    if (typeof extraOptions !== 'undefined') {
      for (let field in extraOptions) {
        if (extraOptions.hasOwnProperty(field)) {
          options[field] = extraOptions[field];
        }
      }
    }
    return this._camera.getPicture(options);
  }


  actionSheet(options?) {
    return new Promise((callback, errorFunc) => {
      let as = this._actionSheetController.create({
        title: 'Where would you like to take the photo from?',
        buttons: [
          {
            text: 'Camera',
            handler: () => {
              return this.getFromCamera(options).then((res) => {
                res = 'data:image/jpeg;base64,' + res;
                return callback(res);
              }).catch((e) => {
                this.errorDisplay(e);
              });
            }
          },
          {
            text: 'Photo Gallery',
            handler: () => {
              this.getFromLibrary(options).then((res) => {
                res = 'data:image/jpeg;base64,' + res;
                return callback(res);
              }).catch((e) => {
                this.errorDisplay(e);
              });
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              return callback(undefined);
            }
          }
        ]
      });
      as.present();
    });
  }

  errorDisplay(text, duration=1500, position='top') {
    let toast = this._toast.create({
      message: text,
      duration: duration,
      position: position
    });
    toast.present();
  }

}
