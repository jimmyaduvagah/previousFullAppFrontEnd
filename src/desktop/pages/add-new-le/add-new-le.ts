import { Component, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  LearningExperience, LearningExperienceCategory,
  LearningExperienceImage
} from "../../../shared/models/LearningExperience";
import { UserService } from "../../../shared/services/user.service";
import { CategoryService } from "../../../shared/services/category.service";
import { LearningExperienceService } from "../../../shared/services/learning-experience.service";
import {
  ToastController, AlertController, NavController, Loading, LoadingController,
  ModalController
} from "ionic-angular";
import { NewLeModule } from "../new-le-module/new-le-module";
import { LearningExperienceImageService } from "../../../shared/services/learning-experience-image.service";
import { ColorPicker } from "../../blocks/color-picker/color-picker";
import { ModalSelectPage } from "../../../pages/modal-select/modal-select";

@Component({
  selector: 'page-le-add-new',
  templateUrl: 'add-new-le.html'
})

export class AddNewLe {
  public userResponse: any;
  public le_states: Array<{ title: string, value: string }> = [{
    title: "Published",
    value: "PUB"
  }, {title: "Not-Published", value: "NOP"}];
  private loading: boolean = true;
  private leForm: FormGroup;
  private le: LearningExperience;
  leimage: File;
  limage: File;
  base64leImage: String = "";
  private category: LearningExperienceCategory;
  public categoryResponse: any;
  private leimageset:boolean = false;
  private imagele: LearningExperienceImage;
  private limagetype: any;
  private category_id: any;
  private color: string = "";
  private loadingController: Loading;
  private currentModal;
  private leAuthor: any = [];
  private leAuthor_ids: any = [];
  private vimeo_id: string = "";


  constructor(private _userService: UserService,
              private _categoryService: CategoryService,
              private _leService: LearningExperienceService,
              private _imageService: LearningExperienceImageService,
              private _toastCtrl: ToastController,
              private _alertCtrl: AlertController,
              private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              public _modalCtrl: ModalController,


  ) {
    this.buildleForm();
    this.getCategories();
    // moved fuction to get categories
    }

  buildleForm() {
    this.leForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      authors: new FormControl('', Validators.required),
      image_id: new FormControl('-', Validators.required),
      image_ip: new FormControl('-', Validators.required),
      vimeo_id: new FormControl(''),
      state: new FormControl('', Validators.required),
      deleted: new FormControl(false, Validators.required),
    });
  }

  setColor(ev: any) {
     this.color = ev;
  }

  showLoading(){
    this.loadingController = this.loadingCtrl.create({
      content: `Loading...`
    });
    this.loadingController.present();
  }

  hideLoading(){
    this.loadingController.dismiss();
  }


  getCategories() {
    this.loading = true;
    this.showLoading();
    this._categoryService.getList().subscribe((res) => {
      this.categoryResponse = res;
      this.loading = false;
      this.hideLoading();
    });
  }

  setCategory(event) {
    this.loading = true;
    console.log(this.categoryResponse.results);
    this.category_id = event;

    var i=0, len=this.categoryResponse.results.length;
        for (; i<len; i++) {
            if (this.categoryResponse.results[i]['id'] == this.category_id) {
                this.category = this.categoryResponse.results[i].title;
                console.log(this.category);
            }
        }

     this.loading = false;
  }

   changeImage(event: EventTarget) {
     console.log('changing image');
     let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
     let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
     let files: FileList = target.files;
     if (files.length === 0) {
       this.leimageset = false;
     } else if(!files[0].type.includes('image')){
         let alert = this._alertCtrl.create({
          title: 'Error',
          subTitle: 'the selected file is not an image',
          buttons: ['Dismiss']
         });
        alert.present();
        this.leimageset = false;
     } else {
      this.leimageset = true;
      this.limage = files[0];
      this.limagetype = files[0].type;
      console.log(this.limagetype)
      console.log(this.limage)
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.limage);
    }

  }

  _handleReaderLoaded(readerEvt) {
     this.loading = true;
     var binaryString = readerEvt.target.result;
     this.base64leImage= btoa(binaryString);
     this.loading = false;
  }

  uploadLe() {
    this.loading = true;
    if(!this.leimageset) {
      let alert = this._alertCtrl.create({
        title: 'Save Error',
        subTitle: 'Please Upload Image to Proceed',
        buttons: ['Dismiss']

      });
      alert.present();
      this.loading = false;
      return false;
    } else {
      var dataurl = 'data:'+ this.limagetype + ';base64,';
      this._imageService.upload64Image( JSON.stringify({"image": dataurl+this.base64leImage})).subscribe((imres) => {
        this.loading = false;
        this.imagele = imres;
        this.postNewle();
      }, (errors) => {
        this.loading = false;
        console.log(errors);
        let alert = this._alertCtrl.create({
          title: 'Save Error',
          subTitle: 'Failed to Upload ' + errors,
          buttons: ['Dismiss']
        });
        alert.present();
      });
    }
  }

  removeAuthor(index) {
    this.leAuthor.splice(index, 1);
    this.leAuthor_ids.push(index, 1);
    this.leForm.controls['authors'].setValue(this.leAuthor_ids);
  }
  selectAuthor() {
      let searchFunction = (text, cb) => {
        this._userService.getList({
          search: text
        }).subscribe((res)=>{
          if (typeof cb !== 'undefined') {
            cb(res.results);
          }
        });
      };

      this.currentModal = this._modalCtrl.create(ModalSelectPage, {
        titleField: 'full_name',
        allowCreateNew: false,
        returnOnSelect: true,
        searchCallback: searchFunction,
      });
      this.currentModal.onDidDismiss(data => {
        if (typeof data !== 'undefined') {
          //this.user.place_of_birth = data.name;
          this.leAuthor.push({'id':data.id, 'name':data.full_name});
          this.leAuthor_ids.push(data.id);
          this.leForm.controls['authors'].setValue(this.leAuthor_ids);
        }
        this.currentModal = undefined;
      });
      this.currentModal.present();
    }

  postNewle() {
    this.loading = true;
    let leData = this.leForm.getRawValue();

    leData.image_id = this.imagele.id;
    leData['category_id'] = this.category_id;
    leData['category'] = this.category;


    this._leService.post(JSON.stringify(leData)).subscribe((res) => {
      this.loading = false;
      this.le = res;
      let toast = this._toastCtrl.create({
        message: 'New Learning Experience Created',
        duration: 1500
      });
      toast.present();
      // open module page
      this.navCtrl.setRoot(NewLeModule, {leid: this.le.id , le:this.le});
    }, (errors) => {
      this.loading = false;
      console.log(errors);
      let alert = this._alertCtrl.create({
        title: 'Save Error',
        subTitle: 'Failed to create Learning Experience' + errors,
        buttons: ['Dismiss']
      });
      alert.present();
    });
  }

}
