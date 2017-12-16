import { Component } from '@angular/core';
import { LearningExperienceCategory } from '../../../shared/models/LearningExperience';
import { Loading, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { CategoryService } from '../../../shared/services/category.service';
import { ListLeCategories } from '../list-category/list-category';


@Component({
  selector: 'edit-category',
  templateUrl: 'edit-le-category.html'
})
export class EditCategory {

  private leCategory : LearningExperienceCategory = new LearningExperienceCategory({});
  private loadingController: Loading;
  private loading: boolean = true;

  constructor(
    public _navParams: NavParams,
    private _categoryService: CategoryService,
    private _nav: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {
    this.leCategory = this._navParams.get('leCategory');

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


  EditCategory(){
    this.showLoading();
    this.loading = true;
    this._categoryService.put(this.leCategory.id, JSON.stringify(this.leCategory))
      .subscribe((res)=>{
      let message = "Category successfully Edited";
      this.hideLoading();
      this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'middle'
      }).present();
      this._nav.setRoot(ListLeCategories);
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






