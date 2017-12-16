import { Component } from "@angular/core";
import { NavController, AlertController, ToastController, LoadingController, Loading, } from "ionic-angular";
import { SessionService } from "../../../shared/services/session.service";
import { StatusBar } from '@ionic-native/status-bar';
import { CourseProgressService } from "../../../shared/services/course-progress.service";
import { UserService } from "../../../shared/services/user.service";
import { ReviewService } from "../../../shared/services/review.service";




@Component({
  selector: 'dashboard-user-activity',
  templateUrl: 'dashboard-user-activity.html'
})
export class dashboardUserActivity {


  private loading: boolean = false;
  private loadingController: Loading;
  private people: any = [];
  private refresher;
  private searchQuery: String  = '';
  private infiniteObject;
  private people_length: number = 0;

  constructor(
    public statusBar: StatusBar,
    public _nav: NavController,
    public _peopleService: UserService,
    public _courseProgressService: CourseProgressService,
    private loadingCtrl: LoadingController,
    public _sessionService: SessionService,
    public _reviewService: ReviewService,
  )
  {
    this.getPeople();
  }

  showLoading(){
    this.loadingController = this.loadingCtrl.create({
      content: `Loading..`
    });
    this.loadingController.present();
  }

  hideLoading(){
    this.loadingController.dismiss();
  }

  getPeople() {
    this.showLoading();

    this.loading = true;
    this._peopleService.getList({search:this.searchQuery}).subscribe((res) => {
      this.people = res.results;
      this.people_length = this.people.length;
      for(let p = 0; p < this.people.length; p++){
        this.getProgress(this.people[p].id , p);
        this.getReviews(this.people[p].id , p);
      }
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }
      this.loading = false;
      this.hideLoading();
    });
  }

  getProgress(id, index ) {
    this._courseProgressService.getList({created_by_id:id}).subscribe((resl) =>{
      this.people[index].progress_object = resl.results;
    });
  }
  getReviews(id, index ) {
    this._reviewService.getList({created_by:id}).subscribe((resl) =>{
       this.people[index].reviews = resl.length;
    });
  }

  filterUsers($event){
    if (typeof $event.target.value !== 'undefined') {
      if ($event.target.value.length > 0) {
        this.searchQuery = $event.target.value;
        this.getPeople();
        return true;
      }
    }
    this.getPeople();
    return false;
  }

  getFinishedLes(progress) {
     progress = JSON.stringify(progress);
     let filtered_json = JSON.parse(progress).filter(function (entry) {
            return entry.completed === true ;
      });
     return filtered_json.length;
  }

  doInfinite($event) {
    this.infiniteObject = $event;
    if (typeof this._peopleService.listObject !== 'undefined' && this._peopleService.listObject.next) {
      // console.log('update requests');
      this._peopleService.getNextList().subscribe( (rs) => {
        for(let p = 0; p < rs.results.length; p++){
          this.getProgress(rs.results[p].id , this.people_length);
          this.getReviews(rs.results[p].id , this.people_length);
            this.people_length++;
            if(p+1 == rs.results.length) {
              this.people.push(...rs.results);
            }
        }
        $event.complete();
      });

    } else if (typeof this._peopleService.listObject !== 'undefined' && !this._peopleService.listObject.next) {
      this.infiniteObject.complete();
      this.infiniteObject.enable(false);
    } else {
      this.infiniteObject.complete();
    }
  }




}
