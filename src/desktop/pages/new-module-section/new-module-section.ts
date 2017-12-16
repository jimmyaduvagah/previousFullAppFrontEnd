import { Component } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { twzColor } from '../../shared/utils/twz-color-util';
import { SessionService } from '../../shared/services/session.service';
import { PostService } from '../../shared/services/post.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LearningExpereienceModuleService } from "../../../shared/services/course-module.service";
import { NavController, NavParams } from 'ionic-angular';
import { AddSection } from "../add-section/add-section";
import { NewLeModule } from "../new-le-module/new-le-module";
import { AddSectionQuiz } from "../add-section-quiz/add-section-quiz";


@Component({
  selector: 'page-module-section',
  templateUrl: 'new-module-section.html'
})

export class NewModuleSection {

  public content_types: Array<{ title: string, value: string }> = [
    {
      title: "Text",
      value: "Text"
    },
    {
      title: "Image",
      value: "Image"
    },
    {
      title: "Video",
      value: "Video"
    },
    {
      title: "Gallery",
      value: "Gallery"
    },
    {
      title: "Quiz",
      value: "Quiz"
    },

  ];
  private loading: boolean = true;
  private moduleSectionForm: FormGroup;
  private module_id: string;
  private module: any;
  private content_type: any;
  private le: any;
  private leid: any;


  constructor(private _moduleService: LearningExpereienceModuleService,
              private _toastCtrl: ToastController,
              private _alertCtrl: AlertController,
              private navCtrl: NavController,
              private navParams: NavParams) {
    this.module_id = this.navParams.get('module_id');
    this.module = this.navParams.get('module');
    this.le = this.navParams.get('le');
    this.leid = this.navParams.get('leid');

    if (this.module_id !== '') {
      let toast = this._toastCtrl.create({
        message: 'Adding module section for the Module' + this.module_id,
        duration: 1500
      });
      toast.present();
    } else {
      let toast = this._toastCtrl.create({
        message: 'Failed to get Module',
        duration: 1500
      });
      toast.present();
    }
    this.buildmoduleForm();
  }

  public  addNewModule() {
     this.navCtrl.setRoot(NewLeModule, {leid: this.le.id , le: this.le});
  }
  buildmoduleForm() {
    this.moduleSectionForm = new FormGroup({
      object_id: new FormControl('-', Validators.required),
      content_type: new FormControl('', Validators.required),
      course_module_id: new FormControl(this.module_id, Validators.required),
    });
  }

  postModuleSection() {
    console.log(this.content_type);
    this.loading = true;
    let moduleData = this.moduleSectionForm.getRawValue();
    console.log(moduleData);
    if(this.content_type =='Quiz' ){
      this.navCtrl.setRoot(AddSectionQuiz, {le: this.le ,leid: this.leid, passtype: this.content_type , moduleData: moduleData , module: this.module , module_id: this.module_id});
    } else {
      console.log(
          {
            le: this.le,
            leid: this.leid,
            passtype: this.content_type,
            moduleData: moduleData,
            module: this.module,
            module_id: this.module_id
          }
      );
      this.navCtrl.setRoot(AddSection, {
        le: this.le,
        leid: this.leid,
        passtype: this.content_type,
        moduleData: moduleData,
        module: this.module,
        module_id: this.module_id
      });
    }
  };

}
