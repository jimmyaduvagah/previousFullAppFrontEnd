import { Component } from '@angular/core';
import { twzColor } from '../../shared/utils/twz-color-util';
import { SessionService } from '../../shared/services/session.service';
import { CategoryService } from '../../../shared/services/category.service';
import { LearningExperienceCategory } from '../../../shared/models/LearningExperience';
import { Loading, LoadingController, NavController, ToastController } from 'ionic-angular';



@Component({
  selector: 'page-add-category',
  templateUrl: 'add-new-category.html'
})
export class AddNewCategory {


  public category: LearningExperienceCategory = new LearningExperienceCategory({});
  private loadingController: Loading;
  private loading: boolean = true;


  constructor(
    private _categoryService: CategoryService,
    private _nav: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  )
  {}
  
  showLoading(){
    this.loadingController = this.loadingCtrl.create({
      content: `Add New Category`
    });
    this.loadingController.present();
  }

  hideLoading(){
    this.loadingController.dismiss();
  }

  AddNewCategory(){
    this.showLoading();
    this.loading = true;
    this._categoryService.post(JSON.stringify(this.category))
      .subscribe((res)=>{
      let message = "Category successfully saved";
      this.hideLoading();
      this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'middle'
      }).present();
      this._nav.setRoot(AddNewCategory);
      },
        (errorMsg) => {
          this.loading = false;
          this.hideLoading();
          let text = '';

          for (let field in errorMsg) {
            if (errorMsg.hasOwnProperty(field)) {
              if (field === 'title') {
                if (errorMsg[field] === 'Title already exist.') {
                  text = text + "The the category provided already exists.\n";
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


}






