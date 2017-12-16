import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SessionService } from '../../shared/services/session.service';
import { User, UserMinimal } from '../../shared/models/User';
import { StatusBar } from '@ionic-native/status-bar';
import { ConnectionService } from '../../shared/services/connection.service';
import { ConnectionRequestService } from '../../shared/services/connection-request.service';
import { ProfilePage } from '../profile/profile';
import { PeopleService } from '../../shared/services/people.service';
import { Connection } from '../../shared/models/Connection';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'contacts-page',
  templateUrl: 'contacts.html'
})
export class ContactsPage {

  public user: User;
  public pending_requests: Connection[] = [];
  public friends: Connection[] = [];
  public people: UserMinimal[] = [];
  public contact: string = "Contacts";

  private rootNavCtrl: NavController;

  private requestsLoadMoreSub;

  private friendsLoadMoreSub;

  private peopleLoadMoreSub;

  private refresher;

  private loadingMyFriends: boolean = true;
  private loadingMyRequests: boolean = true;
  private loadingPeople: boolean = false;
  private hasSearched: boolean = false;

  private searchQuery: string = "";
  private loadingConnectionRequest: boolean = false;

  constructor(public statusBar: StatusBar,
              public _connectionService: ConnectionService,
              public _connectionRequestService: ConnectionRequestService,
              public _peopleService: PeopleService,
              public navCtrl: NavController,
              public navParams: NavParams,
              public _sessionService: SessionService,
              private _analytics: AnalyticsService
  ) {
    // this.statusBar.backgroundColorByHexString(twzColor.orangeDarkHex);
    this.rootNavCtrl = navParams.get('rootNavCtrl') || navCtrl;

    if (typeof this._sessionService.user !== 'undefined') {
      this.user = this._sessionService.user;
    } else {
      this._sessionService.userObservable.subscribe((res) => {
        this.user = res;
      });
    }
    this.getMyRequests();
    this.getMyFriends();

  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this._analytics.getSelectedTab() === 3) {
        this._analytics.logScreenView(this.constructor.name);
      }
    }, 250);
  }


  ngOnDestroy() {
    if (typeof this.requestsLoadMoreSub !== "undefined") {
      this.requestsLoadMoreSub.unsubscribe();
    }

    if (typeof this.friendsLoadMoreSub !== "undefined") {
      this.friendsLoadMoreSub.unsubscribe();
    }

    if (typeof this.peopleLoadMoreSub !== "undefined") {
      this.peopleLoadMoreSub.unsubscribe();
    }

  }

  public getMyRequests(){
    this.loadingMyRequests = true;
    this._connectionRequestService.myReceivedRequests().subscribe((res) => {

      this.pending_requests = res.results;
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }

      this.loadingMyRequests = false;
    });
  }

  getMyFriends() {
    this.loadingMyFriends = true;
    this._connectionService.getList().subscribe((res) => {
      this.friends = res.results;
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }
      this.loadingMyFriends = false;
    });
  }

  getPeople(){
    this.loadingPeople = true;
    this._peopleService.getList({search:this.searchQuery}).subscribe((res) => {
      this.people = res.results;
      if (this.refresher) {
        this.refresher.complete();
        this.refresher = null;
      }
      this.loadingPeople = false;
      // console.log(this.people);
      // console.log('my People Search ', JSON.stringify(res));
    });
  }

  onInput(event) {
    // console.log(event);
    // console.log('input',this.searchQuery);
    this.hasSearched = true;
    this.getPeople();

  }

  onCancel(event) {
    // console.log(event);
    // console.log('cancel',this.searchQuery);
    this.hasSearched = false;
    this.getPeople();
  }

  goToUserProfile($event) {
    this.rootNavCtrl.push(ProfilePage, {
      userId: $event.id
    });
  }

  public createRequest(person) {
    person.loadingConnectionRequest = true;
    // console.log('reject ',requestId);
    this._connectionRequestService.post({to_user_id:person.id}).subscribe((res) => {
      person.pending_request = res.id;
      person.loadingConnectionRequest = false;
      this._analytics.logEvent('connections', 'user-made-request');

    }, (err) => {
      person.loadingConnectionRequest = false;
      console.log(err);
    });
  }

  public withdrawRequest(person) {
    person.loadingConnectionRequest = true;
    this._connectionRequestService.withdrawRequest(person.pending_request).subscribe((res) => {
      person.pending_request = null;
      person.loadingConnectionRequest = false;
      this._analytics.logEvent('connections', 'user-withdrew-request');
    }, (err) => {
      person.loadingConnectionRequest = false;
      console.log(err);
    });
  }

  public acceptRequest(request) {
    request.loadingConnectionRequest = true;
    // console.log('accept ',requestId);
    this._connectionRequestService.acceptRequest(request.id).subscribe((res) => {
      request.responded = true;
      request.respondedText = "Accepted";
      request.loadingConnectionRequest = false;
      this._analytics.logEvent('connections', 'user-accepted-request');
    }, (err) => {
      request.loadingConnectionRequest = false;
      console.log(err);
    });
  }

  public rejectRequest(request) {
    request.loadingConnectionRequest = true;
    // console.log('reject ',requestId);
    this._connectionRequestService.rejectRequest(request.id).subscribe((res) => {
      request.responded = true;
      request.respondedText = "Rejected";
      this._analytics.logEvent('connections', 'user-rejected-request');
      request.loadingConnectionRequest = false;
    });
  }

  doInfinite($event){
    // console.log($event, this.contact);

    if (this.contact == "Requests") {
      //requests
      if (typeof this._connectionRequestService.myReceivedRequestsListObject !== 'undefined' && this._connectionRequestService.myReceivedRequestsListObject.next) {
        // console.log('update requests');
        this.requestsLoadMoreSub = this._connectionRequestService.getNextMyReceivedRequests().subscribe((res) => {
          this.pending_requests.push(...res.results);
          $event.complete();
        });
      } else {
        $event.complete();
      }


    } else if ( this.contact == "Contacts") {
      //friends
      if (typeof this._connectionService.listObject !== 'undefined' && this._connectionService.listObject.next) {
        // console.log('update contacts');
        this.friendsLoadMoreSub = this._connectionService.getNextList().subscribe((res) => {
          this.friends.push(...res.results);
          $event.complete();
        });

      } else {
        $event.complete();
      }



      // $event.complete();
    } else if ( this.contact == "Search") {
      //search
      if (typeof this._peopleService.listObject !== 'undefined' && this._peopleService.listObject.next) {
        // console.log('update people');
        this.peopleLoadMoreSub = this._peopleService.getNextList().subscribe((res) => {
          this.people.push(...res.results);
          $event.complete();
        });

      } else {
        $event.complete();
      }

    } else {
      $event.complete();
    }

  }


  doRefresh($event){
    // console.log($event, this.contact);
    this.refresher = $event;

    if (this.contact == "Requests") {
      //requests
      this.getMyRequests();

    } else if ( this.contact == "Contacts") {
      //friends
      this.getMyFriends();

    } else if ( this.contact == "Search") {
      //search
      this.getPeople();

    } else {
      $event.complete();
      this.refresher = null;
    }

  }

  goToSearch() {
    this.contact = "Search";
  }


}
