import { Component } from "@angular/core";
import {AlertController, ToastController, ViewController, NavParams, NavController} from 'ionic-angular';
import {LearningExperienceImageService} from "../../../shared/services/learning-experience-image.service";
import {GalleryImageService} from "../../../shared/services/learning-experience-sections.service";
import {EditModuleSections} from "../edit-module-section/edit-module-section";
import {LearningExperienceModule} from "../../../shared/models/LearningExperienceModule";
import {ListModuleSections} from "../list-module-sections/list-module-sections";

@Component({
  template: `
    <ion-list>
      <ion-list-header></ion-list-header>      
      <ion-item *ngIf="options">
        <label> Change Image </label>
        <input name="image" type="file" (change)="changeImage($event)">
      </ion-item> 
      <ion-item *ngIf="!options">
        <button ion-item (tap)="deleteImage()">Delete Image</button>
      </ion-item>
    </ion-list>
  `
})
export class PopoverPage {
  private imageset: boolean;
  private modimage: any;
  private base64Image: String = "";
  private loading: boolean = true;
  private imagetype: any;
  private image: any;
  private image_id: string;
  private galaryImageID: any;
  private galleryID:any;
  private order:number;
  public module: LearningExperienceModule;
  private module_id: string;
  private le: any;
  private leid: any;
  private section_id: any;
  private section: any;
  private moduleSection: any;
  private options: boolean = true;

  constructor(public viewCtrl: ViewController,
              private _toastCtrl: ToastController,
              private _alertCtrl: AlertController,
              private _navParams: NavParams,
              private _imageService: LearningExperienceImageService,
              private _galleryImageService: GalleryImageService,
              private  _nav: NavController
  ) {
    this.galleryID = _navParams.get('gal_id');
    this.galaryImageID = _navParams.get('galImg_id');
    this.order = _navParams.get('ord');
    this.module = this._navParams.get('module');
    this.module_id = this._navParams.get('module_id');
    this.moduleSection = this._navParams.get('moduleSection');
    this.options = this._navParams.get('op');
    this.section = this.moduleSection.related;
    this.leid = this._navParams.get('leid');
    this.le = this._navParams.get('le');
    this.section_id = this._navParams.get('section_id');
  }

   public changeImage(event: EventTarget) {
    console.log('changing image');
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    if(files.length === 0 ){
      this.imageset = false;
    } else {
      this.imageset = true;
      this.modimage = files[0];
      this.imagetype = files[0].type;
      console.log(this.modimage)
      var reader = new FileReader();
      reader.onloadend = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.modimage);
      console.log(this.base64Image);
      this.uploadImage();
    }
  }
  _handleReaderLoaded(readerEvt) {
     this.loading = true;
     var binaryString = readerEvt.target.result;
     this.base64Image= btoa(binaryString);
     this.loading = false;
  }
  uploadImage() {
    this.loading = true;
    if(this.base64Image) {
      let dataurl = 'data:' + this.imagetype + ';base64,';
      this._imageService.upload64Image(JSON.stringify({"image": dataurl + this.base64Image})).subscribe((res) => {
        this.loading = false;
        this.image = res;
        this._galleryImageService.put(this.galaryImageID, JSON.stringify({
          'image_id': this.image.id, 'gallery': this.galleryID, 'gallery_id': this.galleryID,
          'order': this.order })).subscribe((res=>{
          console.log(res);
          let i = 0, len = this.section.gallery.images.length;
          for(; i<len; i++) {
            if(this.section.gallery.images[i].id === this.galaryImageID){
              this.moduleSection.related.gallery.images[i] = res;
            }
          }
        }));
        let toast = this._toastCtrl.create({
          message: 'image uploaded',
          duration: 1500
        });
        toast.present();
        this._nav.popTo(EditModuleSections, {
          leid: this.le.id,
          le: this.le,
          module_id :this.module.id,
          module: this.module,
          moduleSection: this.moduleSection,
          section_id: this.section_id,
        });
      }, (errors) => {
        this.loading = false;
        console.log(errors);
        let alert = this._alertCtrl.create({
          title: 'Save Error',
          subTitle: 'Failed to Upload, Try again please',
          buttons: ['Dismiss']
        });
        alert.present();
      });
    }
  } 
  close() {
    this.viewCtrl.dismiss();
  }
  deleteImage() {
    this._galleryImageService.delete(this.galaryImageID).subscribe((res)=>{
          console.log(res);
          let i = 0, len = this.moduleSection.related.gallery.images.length;
          for(; i<len; i++) {
            if(this.moduleSection.related.gallery.images === this.galaryImageID){
              this.moduleSection.related.gallery.images.splice(i, 1);
            }
          }
          let toast = this._toastCtrl.create({
          message: 'image deleted',
          duration: 1500
        });
        toast.present();
        this._nav.popTo(EditModuleSections, {
          leid: this.le.id,
          le: this.le,
          module_id :this.module.id,
          module: this.module,
          moduleSection: this.moduleSection,
          section_id: this.section_id,
        });
      }, (errors) => {
        this.loading = false;
        console.log(errors);
        let alert = this._alertCtrl.create({
          title: 'Save Error',
          subTitle: 'Failed to delete image, Try again please',
          buttons: ['Dismiss']
        });
        alert.present();
      });
  }
}
