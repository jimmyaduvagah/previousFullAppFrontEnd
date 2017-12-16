import { Component, ViewChild } from '@angular/core';
import { LearningExperience, LearningExperienceImage } from '../../../shared/models/LearningExperience';
import {
  AlertController, Loading, NavController, NavParams, ToastController, LoadingController,
  ModalController
} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { CategoryService } from '../../../shared/services/category.service';
import { ListLe } from '../list-le/list-le';
import { LearningExperienceService } from '../../../shared/services/learning-experience.service';
import { UserService } from '../../../shared/services/user.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LearningExperienceImageService } from "../../../shared/services/learning-experience-image.service";
import { ModalSelectPage } from "../../../pages/modal-select/modal-select";
import { LearningExperienceModule } from '../../../shared/models/LearningExperienceModule';
import { LearningExpereienceModuleService } from '../../../shared/services/course-module.service';
import { EditLeModule } from '../edit-le-module/edit-le-module';
import { NewLeModule } from '../new-le-module/new-le-module';


@Component({
  selector: 'edit-le',
  templateUrl: 'edit-le.html'
})

export class EditLe {

  @ViewChild('imageInput')
  public imageInput;

  public le_states: Array<{ title: string, value: string }> = [{
    title: "Published",
    value: "PUB"
  }, {title: "Not-Published", value: "NOP"}];
  public userResponse: any;
  public categoryResponse: any;
  private le: LearningExperience;
  private leModules: LearningExperienceModule[];
  private loading: boolean = true;
  private loadingController: Loading;
  private leForm: FormGroup;
  private category: string;
  private category_id: string;
   leImage: File;
   modimage: File;
  base64Image: String = "";
  private imageset:boolean = false;
  private image: LearningExperienceImage;
  private imagetype: any;
  private categorySet: boolean = false;
  private leAuthor: any = [];
  private leAuthor_ids: any = [];
  private currentModal;
  private vimeo_id: string = "";
  private loadingModules: any = false;
  private addNewModule = {
    title: "Add New Module",
    image: {
      src: "assets/imgs/new-module-image.png",
      color: '#ffffff',
    }
  };


  constructor(
    public _navParams: NavParams,
    public statusBar: StatusBar,
    public _leService: LearningExperienceService,
    public _categoryService: CategoryService,
    public _modalCtrl: ModalController,
    private _userService: UserService,
    private _nav: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _alertCtrl: AlertController,
     private _imageService: LearningExperienceImageService,
    private _leModuleService: LearningExpereienceModuleService,


  )
    {
      this.le = this._navParams.get('le');
      console.log('learnin Epe',this.le);
      for(var a=0; a < this.le.authors_json.length; a++ ){
        this.leAuthor.push({'id': this.le.authors_json[a]['id'] , 'name':this.le.authors_json[a]['name']});
        this.leAuthor_ids.push(this.le.authors_json[a]['id']);
      }
    this.getCategories();
    this.getUsers();
    this.buildleForm();


  }

  ionViewWillEnter() {
    // this is in here so when we pop back from editing/adding modules it refrehses the list
    this.getLeModules();
  }

  buildleForm() {
    this.leForm = new FormGroup({
      title: new FormControl(this.le.title),
      description: new FormControl(this.le.description),
      authors: new FormControl(this.le.authors),
      authors_json: new FormControl(this.le.authors_json),
      image_id: new FormControl(this.le.image_id),
      image_ip: new FormControl('-', Validators.required),
      category_id: new FormControl(this.le.category_id),
      category: new FormControl(this.le.category),
      state: new FormControl(this.le.state),
      deleted: new FormControl(false),
      vimeo_id: new FormControl(this.le.vimeo_id),
    });
  }

  getCategories() {
    this.loading = true;
    this._categoryService.getList().subscribe((res) => {
      this.categoryResponse = res;
    });

  }

  getLeModules(searchTerm:any=undefined) {
    this.loadingModules = true;
    let params = {
      course: this.le.id
    };
    if (typeof searchTerm !== 'undefined') {
      params['search'] = searchTerm;
    }
    this._leModuleService.getList(params).subscribe((res) => {
      this.leModules = res.results;
      this.loadingModules = false;
    }, (err) => {
      this.loadingModules = false;
    });
  }

  public setCategory(event) {
    this.loading = true;
    this.categorySet = true;
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
  getUsers() {
    this._userService.getList().subscribe((res) => {
      this.userResponse = res;
      this.leAuthor = this.le.authors_json;
      console.log(this.leAuthor);
      this.loading = false;
    });
  }

  showLoading(){
    this.loadingController = this.loadingCtrl.create({
      content: `Editing...`
    });
    this.loadingController.present();
  }

  hideLoading(){
    this.loadingController.dismiss();
  }

    public changeImage(event: EventTarget) {
    console.log('changing image');
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    if(files.length === 0 ) {
      this.imageset = false;

    } else if(!files[0].type.includes('image')){
         let alert = this._alertCtrl.create({
          title: 'Error',
          subTitle: 'the selected file is not an image',
          buttons: ['Dismiss']
         });
        alert.present();
        this.imageset = false;

    } else {
      this.imageset = true;
      this.modimage = files[0];
      this.imagetype = files[0].type;
      console.log(this.modimage)
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.modimage);
    }

  }

  _handleReaderLoaded(readerEvt) {
     this.loading = true;
     var binaryString = readerEvt.target.result;
            this.base64Image= btoa(binaryString);
     this.loading = false;
  }

  base64Url() {
    return 'data:'+ this.imagetype + ';base64,' + this.base64Image;
  }

  clearImage() {
    this.imageset = false;
    this.base64Image = null;
    this.imagetype = null;
    this.modimage = null;
  }

  uploadModule () {
    this.loading = true;
    if(this.imageset){
      var dataurl = 'data:'+ this.imagetype + ';base64,';
      this._imageService.upload64Image(JSON.stringify({"image": dataurl+this.base64Image})).subscribe((imres) => {
        this.loading = false;
        this.image = imres;
        let toast = this.toastCtrl.create({
        message: 'image uploaded',
        duration: 1500
        });
        toast.present();
        this.editLe();
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
    } else {
        this.editLe();
    }
  }

  removeAuthor(index) {
    this.leAuthor.splice(index, 1);
    this.leAuthor_ids.splice(index, 1);
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
          this.leForm.controls['authors_json'].setValue(this.leAuthor);

          console.log(this.leAuthor_ids);
          console.log(this.leAuthor);
        }
        this.currentModal = undefined;
      });
      this.currentModal.present();
    }


  editLe(){
    this.showLoading();
    this.loading = true;
    let leData = this.leForm.getRawValue();
    leData['authors']= this.leAuthor_ids;
    console.log('ledata',leData);
    if(this.imageset){
       leData['image_id'] = this.image.id;
    }
    if(this.categorySet){
      leData['category'] = this.category;
      leData['category_id'] = this.category_id;

    }

    this._leService.put(this.le.id, JSON.stringify(leData))
      .subscribe((res)=>{
      let message = "LE successfully Edited";
      this.hideLoading();
      this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'middle'
      }).present();
      this._nav.setRoot(ListLe);
      },
        (errorMsg) => {
          this.loading = false;
          this.hideLoading();
          let text = '';

          for (let field in errorMsg) {
            if (errorMsg.hasOwnProperty(field)) {
              if (field === 'title') {
                if (errorMsg[field] === 'Title already exist.') {
                  text = text + "The  LE provided already exists.\n";
                }
                else {
                  text = text + field + ':' + errorMsg[field] + "\n";
                }
              }
              else {
                text = text + field + ':' + errorMsg[field] + "\n";
              }
            }
          }
          if (errorMsg.hasOwnProperty('non_field_errors')){
            text = text + errorMsg.non_field_errors;
          }
          this.toastCtrl.create({
            message: text,
            duration: 5000,
            position: 'middle'
          }).present();
        });
  }

  focusImageInput() {
    // console.log('focusImageInput',  this.imageInput);
    this.imageInput.nativeElement.click();
  }

  goToLeModule(module) {
    this._nav.push(EditLeModule, {
      module: module,
      le: this.le
    })
  }

  goToNewModule() {
    this._nav.push(NewLeModule, {leid: this.le.id , le: this.le});
  }






}
