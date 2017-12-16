import {Component, ViewChild} from "@angular/core";
import {AlertController, ToastController,  NavParams, NavController} from 'ionic-angular';
import {LearningExperienceImageService} from "../../../shared/services/learning-experience-image.service";
import {GalleryImageService} from "../../../shared/services/learning-experience-sections.service";
import {EditModuleSections} from "../edit-module-section/edit-module-section";
import {LearningExperienceModule} from "../../../shared/models/LearningExperienceModule";
import {ListModuleSections} from "../list-module-sections/list-module-sections";


@Component({
  selector: 'edit-gallery-image.ts',
  templateUrl: 'edit-gallery-image.html'
})
export class EditGalleryImage {
  private module: LearningExperienceModule;
  private loading: boolean = true;
  private module_id: string;
  private le: any;
  private leid: any;
  private section_id: any;
  private section: any;
  private moduleSection: any;
  private base64ImageChange: string;
  private base64ImageAdd: string;
  private imageTypeChange: string;
  private imagetypeAdd: string;
  private imageIsset: boolean;
  private uploadedImage: any;
  private gallaryImageID: any;
  private galleryID: any;
  private order: any;
  private options: boolean = false;
  private galimage: any;
  private imageChangedSuccess: boolean = false;
  private imageAddSuccess: boolean = false;
  private changeResult: any;
  private addResult: any;
  @ViewChild('fileInput') fileInput;
  @ViewChild('fileInput2') fileInput2;
  @ViewChild('fileInput3') fileInput3;

  constructor(private _toastCtrl: ToastController,
              private _alertCtrl: AlertController,
              private _navParams: NavParams,
              private _imageService: LearningExperienceImageService,
              private _galleryImageService: GalleryImageService,
              private  _nav: NavController
  ) {
    this.galimage =this._navParams.get('galimage');
    this.leid = this._navParams.get('leid');
    this.le = this._navParams.get('le');
    this.section_id = this._navParams.get('section_id');
    this.galleryID = _navParams.get('gal_id');
    this.gallaryImageID = _navParams.get('galImg_id');
    this.order = _navParams.get('ord');
    this.module = this._navParams.get('module');
    this.module_id = this._navParams.get('module_id');
    this.moduleSection = this._navParams.get('moduleSection');
    this.section = this.moduleSection.related;
    this.options = this._navParams.get('op');
  }

  public changeImage(event: EventTarget) {
    console.log('changing image');
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    if (files.length === 0) {
      this.imageIsset = false;
    } else {
      this.imageIsset = true;
      this.uploadedImage = files[0];
      this.imageTypeChange = files[0].type;
      console.log(this.uploadedImage)
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.uploadedImage);
    }
  }
  _handleReaderLoaded(readerEvt) {
    this.loading = true;
    let binaryString = readerEvt.target.result;
    this.base64ImageChange = btoa(binaryString);
    this.loading = false;
  }

  public changeImage2(event: EventTarget) {
    console.log('changing image');
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    if (files.length === 0) {
      this.imageIsset = false;
    } else {
      this.imageIsset = true;
      this.uploadedImage = files[0];
      this.imagetypeAdd = files[0].type;
      console.log(this.uploadedImage)
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded2.bind(this);
      reader.readAsBinaryString(this.uploadedImage);
    }
  }
  _handleReaderLoaded2(readerEvt) {
    this.loading = true;
    let binaryString = readerEvt.target.result;
    this.base64ImageAdd = btoa(binaryString);
    this.loading = false;
  }

  changeGalleryImage() {
    let dataurl = 'data:' + this.imageTypeChange + ';base64,';
    this._imageService.upload64Image(JSON.stringify({'image': dataurl + this.base64ImageChange})).subscribe(
      (res) => {
        let imageResponse = res;
        this._galleryImageService.put(this.gallaryImageID, JSON.stringify({
          'image_id': imageResponse.id, 'gallery': this.galleryID, 'gallery_id': this.galleryID,
              'order': this.order })).subscribe((res) => {
          console.log(res);
          this.changeResult = res;
          this.imageChangedSuccess = true;
        },(errors) => {
            console.log(errors);
            this.imageChangedSuccess = true;
            });
        if(this.imageChangedSuccess) {
           let toast = this._toastCtrl.create({
              message: 'image changed successfully',
              duration: 5000
           });
           toast.present();
           this._nav.pop();
        }
        },(errors) => {
            console.log(errors);
            let alert = this._alertCtrl.create({
              title: 'Save Error',
              subTitle: 'Failed to Change/Edit the image, Try again please',
              buttons: ['Dismiss']
            });
            alert.present();
      });
  }

  changeGalleryImage2() {
    let dataurl = 'data:' + this.imagetypeAdd + ';base64,';
    this._imageService.upload64Image(JSON.stringify({'image': dataurl + this.base64ImageAdd})).subscribe(
      (res) => {
        let imageResponse = res;
        this.order = this.section.gallery.images.length + 1;
          this._galleryImageService.post(JSON.stringify({
          'image_id': imageResponse.id, 'gallery': this.galleryID, 'gallery_id': this.galleryID,
              'order': this.order })).subscribe((res) => {
              console.log(res);
              this.changeResult = res;
              this.moduleSection.related.gallery.images.push(res);
               let toast = this._toastCtrl.create({
              message: 'image added to gallery section successfully',
              duration: 5000
             });
             toast.present();
             this._nav.pop();
          },(errors) => {
            console.log(errors);
            let alert = this._alertCtrl.create({
              title: 'Save Error',
              subTitle: 'Failed to Change/Edit the image, Try again please',
              buttons: ['Dismiss']
            });
            alert.present();
          });

      },(errors) => {
            console.log(errors);
            let alert = this._alertCtrl.create({
              title: 'Save Error',
              subTitle: 'Failed to Change/Edit the image, Try again please',
              buttons: ['Dismiss']
            });
            alert.present();
      });
  }


}
