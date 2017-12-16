import {Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SessionService} from '../../../shared/services/session.service';
import { CategoryService } from '../../../shared/services/category.service';
import { EditCategory } from '../edit-category/edit-le-category';
import { AddNewCategory } from '../add-new-category/add-new-category';



@Component({
  selector: 'list-le-category',
  templateUrl: 'list-category.html'
})
export class ListLeCategories {


  public leCategoryResponse: Response;
  private loading: boolean= true;

  constructor(
    public statusBar: StatusBar,
    public _nav: NavController,
     public _navParams: NavParams,
    public _leCategoryService: CategoryService,
    public _sessionService: SessionService,
  )
  {
    this.getCategories();
  }

  getCategories(searchTerm:any=undefined) {
    let params = {};
    if (typeof searchTerm !== 'undefined') {
      params['search'] = searchTerm;
    }

    this._leCategoryService.getList(params).subscribe((res) => {
      this.leCategoryResponse = res;
      this.loading = false;
    });
  }

    filterLes($event) {
    if (typeof $event.target.value !== 'undefined') {
      if ($event.target.value.length > 0) {
        this.getCategories($event.target.value);
        return true;
      }
    }
    this.getCategories();
    return false;
  }

  goToEditCategory(leCategory) {
    this._nav.push(EditCategory, {
      leCategory: leCategory
    });
  }

  addNewCategory(){
     this._nav.setRoot(AddNewCategory);
  }


}
