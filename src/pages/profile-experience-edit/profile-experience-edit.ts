import { Component, AfterViewInit, OnDestroy, ApplicationRef } from '@angular/core';
import {
  NavController, ModalController, LoadingController, Loading, ViewController,
  ToastController, NavParams, Keyboard, AlertController
} from 'ionic-angular';
import { PostService } from '../../shared/services/post.service';
import { PostStore } from '../../shared/services/post.store';
import { StatusBar } from '@ionic-native/status-bar';
import { SessionService } from "../../shared/services/session.service";
import { User } from "../../shared/models/User";
import { UserService } from "../../shared/services/user.service";
import { ExperienceService } from "../../shared/services/experience.service";
import { ModalSelectPage } from '../modal-select/modal-select';
import { TownService } from '../../shared/services/town.service';
import { Experience } from '../../shared/models/Experience';
import { InstitutionService } from '../../shared/services/institution.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AnalyticsService } from '../../shared/services/analytics.service';

@Component({
  selector: 'page-profile-experience-edit',
  templateUrl: 'profile-experience-edit.html'
})
export class ProfileExperienceEditPage implements AfterViewInit, OnDestroy {

  title = '';
  currentUser: User;
  loading: boolean = true;
  loadingController: Loading;
  items: Experience[] = [];
  private institutionFieldName = 'Employer';
  private institutionFieldNameAAN = 'a';
  private institutionType = '';
  private institutionTypeId = '';
  private institutionGetMethod = '';
  private experienceTypeId = '';
  private type: string;
  private callback = (res) => {
  };

  constructor(public statusBar: StatusBar,
              public _modalCtrl: ModalController,
              public _feedService: PostService,
              public _viewController: ViewController,
              private navCtrl: NavController,
              private navParams: NavParams,
              private _instituteService: InstitutionService,
              private _userService: UserService,
              private _keyboard: Keyboard,
              private _townService: TownService,
              private _sessionService: SessionService,
              private _alertCtrl: AlertController,
              private _toastCtrl: ToastController,
              private _experienceService: ExperienceService,
              private loadingCtrl: LoadingController,
              private _formBuilder: FormBuilder,
              private _applicationRef: ApplicationRef,
              private _postStore: PostStore,
              private _analytics: AnalyticsService) {
    // this.statusBar.backgroundColorByHexString(twzColor.blueDarkHex);
    this.showLoading();

    let cb = this.navParams.get('callback');
    let title = this.navParams.get('title');
    let type = this.navParams.get('type');
    if (type) this.type = type;
    if (title) this.title = title;
    if (cb) this.callback = cb;

    switch (this.type) {
      case 'job':
        this.experienceTypeId = 'eac3313e-f22e-4301-9169-477aa4b8b313';
        this.institutionTypeId = '0ab141d5-9d01-4c42-836e-fb3dd0fe29ef';
        this.institutionType = 'Job';
        this.institutionFieldName = 'Employer';
        this.institutionFieldNameAAN = 'an';
        this.institutionGetMethod = 'getJobs';
        break;
      case 'education':
        this.experienceTypeId = '2df68ab6-5b76-4996-9a77-a62e07bc552d';
        this.institutionTypeId  = 'b56b2954-d1c2-4666-a3d2-6d39665309fd';
        this.institutionType = 'Education';
        this.institutionFieldName = 'School';
        this.institutionFieldNameAAN = 'a';
        this.institutionGetMethod = 'getEducation';
        break;
    }

    if (_sessionService.user) {
      this.currentUser = _sessionService.user;
      this.getItems();
    } else {
      let sub = _sessionService.userObservable.subscribe((user) => {
        this.currentUser = user;
        this.getItems();
        sub.unsubscribe();
      });
    }
  }

  ionViewDidEnter() {
    this._analytics.logScreenView(this.constructor.name);
  }

  formsAreValid() {
    for (let item of this.items) {
      if (item.hasOwnProperty('form')) {
        if (item['form'].valid === false) return false;
      }
    }
    return true;
  }

  makeFormGroup(type='') {
    type = type.toLowerCase();
    switch (type) {
      case 'education':
        return this._formBuilder.group({
          degree: ['', Validators.compose([Validators.maxLength(255), Validators.required])],
          institution_id: ['', Validators.required],
          summary: [''],
          date_to: [''],
          date_from: ['', Validators.required]
        });
      case 'job':
      default:
        return this._formBuilder.group({
          job_title: ['', Validators.compose([Validators.maxLength(255), Validators.required])],
          institution_id: ['', Validators.required],
          summary: [''],
          date_to: [''],
          date_from: ['', Validators.required]
        });
    }
  }

  getItems() {
    this._experienceService[this.institutionGetMethod]({
      user_id: this.currentUser.id
    }).subscribe((res) => {
      for (let index in res.results) {
        res.results[index].form = this.makeFormGroup(res.results[index].type);
      }
      this.items = res.results;
      if (this.items.length === 0) {
        this.newExperience();
      }
      this.loading = false;
      this.hideLoading()
    }, (err) => {
      this.hideLoading()
    });
  }

  showLoading(msg = 'Loading') {
    this.loadingController = this.loadingCtrl.create({
      content: msg
    });
    this.loadingController.present();
  }

  hideLoading() {
    this.loadingController.dismiss();
  }

  showToast(msg) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.callback = null;
  }

  validateField(formIndex, field, value) {
    // setTimeout(() => { // defers for smooth typing.
    //   let validations = [];
    //   this.formErrors[formIndex][field] = undefined;
    //   switch(field) {
    //     case 'job_title':
    //       validations.push('required');
    //       break;
    //   }
    //   for (let validation of validations) {
    //     switch (validation){
    //       case 'required':
    //         if (
    //           typeof value === 'undefined' ||
    //           value === null ||
    //           value.length === 0
    //         ) {
    //           this.formErrors[formIndex][field] = true;
    //         }
    //         break;
    //     }
    //     this._applicationRef.tick();
    //   }
    // }, 10);
  }

  // initialDateLoad(index, field) {
  //   if (this.items[index][field] === '' || this.items[index][field] === null || typeof this.items[index][field] === 'undefined') {
  //     let now = moment(new Date());
  //     this.items[index][field] = now.format('YYYY-MM-DD');
  //   }
  // }

  clearField(index, field_name, field?) {
    // console.log(field);
    // We need to disable the field, then have a delay in enabling it so the date picker doesn't re-open on clear.
    if (field) {
      field.disabled = true;
    }

    this.items[index][field_name] = null;

    if (field) {
      // needs the timeout or it happens too fast and still opens
      setTimeout(() => {
        field.disabled = null;
      }, 100);

    }
  }

  removeExperience(index) {
    let item = this.items[index];
    let alert = this._alertCtrl.create({
      title: 'Confirm Removal',
      message: 'Are you sure you want to remove this experience?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            if (this.items[index].hasOwnProperty('id') && this.items[index].id.length > 0) {
              this.showLoading();
              this._experienceService.delete(item.id).subscribe((res) => {
                this.items.splice(index, 1);
                this.hideLoading();
              }, (err) => {
                console.log(err);
                this.hideLoading();
              });
            } else {
              this.items.splice(index, 1);
            }
          }
        }
      ]
    });
    alert.present();
  }

  newExperience() {
    let now = moment(new Date());
    this.items.unshift(new Experience({
      type: this.institutionType,
      type_id: this.experienceTypeId,
      date_from: now.format('YYYY-MM'),
      form: this.makeFormGroup(this.type)
    }));
    this._applicationRef.tick();
  }

  save() {
    if (!this.formsAreValid()) {
      let alert = this._alertCtrl.create({
        title: 'Required Fields Missing',
        message: 'Please make sure all required(*) fields are filled in.',
        buttons: [
            'OK'
        ]
      });
      alert.present();
      return false;
    }
    this.showLoading('Saving');
    let chain = [];
    let results = [];
    for (let item of this.items) {
      let cleanItem = new Experience(item);
      if (cleanItem.hasOwnProperty('form')) {
        cleanItem['form'] = undefined;
        delete cleanItem['form'];
      }
      if (cleanItem.date_from) {
        if (cleanItem.date_from.match('^[0-9][0-9][0-9][0-9]-[0-9][0-9]$')) {
          cleanItem.date_from = cleanItem.date_from.replace('^([0-9][0-9][0-9][0-9])-([0-9][0-9])$', '$1-$2') + '-01'
        }
      } else {
        cleanItem.date_from = null;
      }

      if (cleanItem.date_to) {
        if (cleanItem.date_to.match('^[0-9][0-9][0-9][0-9]-[0-9][0-9]$')) {
          cleanItem.date_to = cleanItem.date_to.replace('^([0-9][0-9][0-9][0-9])-([0-9][0-9])$', '$1-$2') + '-01'
        }
      } else {
        cleanItem.date_to = null;
      }
      if (typeof item.id === 'undefined') {
        chain.push(this._experienceService.post(cleanItem));
      } else {
        chain.push(this._experienceService.put(cleanItem.id, cleanItem));
      }
    }
    let subscriptionCallback = (res) => {
      results.push(res);
      chain.splice(0, 1);
      if (chain.length > 0) {
        chain[0].subscribe(subscriptionCallback);
      } else {
        this.hideLoading();
        this.callback(results);
        this._analytics.logEvent('user', 'edited-experience');

        this.navCtrl.pop();
      }
    };
    chain[0].subscribe(subscriptionCallback, (err) => {
      this.hideLoading();
      let alert = this._alertCtrl.create({
        title: 'Error Saving',
        message: 'There was an error saving, please check your form fields and try again.',
        buttons: [
          'OK'
        ]
      });
      alert.present();
      console.log(err);
    })

  }

  cancel() {
    this.navCtrl.pop();
  }

  didScroll($event) {
    if (this._keyboard.isOpen()) {
      this._keyboard.close();
    }
  }

  private modal;

  showInstituteSelectModal(item: Experience, index: number) {
    if (typeof this.modal === 'undefined') {
      let createNewFunction = (text, cb) => {
        this._instituteService.post({
          title: text,
          type_id: this.institutionTypeId
        }).subscribe((res) => {
          if (typeof cb !== 'undefined') {
            cb(res);
          }
        }, (err) => {
          console.log(err);
          cb();
        });
      };
      let searchMethod = '';
      switch(this.type) {
        case 'education':
          searchMethod = 'searchForSchool';
          break;
        default:
        case 'job':
          searchMethod = 'searchForBusiness';
          break;

      }
      let searchFunction = (text, cb) => {
        this._instituteService[searchMethod]({
          search: text
        }).subscribe((res) => {
          if (typeof cb !== 'undefined') {
            cb(res.results);
          }
        });
      };
      this.modal = this._modalCtrl.create(ModalSelectPage, {
        titleField: 'title',
        allowCreateNew: true,
        emptyWhenNoSearch: true,
        returnOnSelect: true,
        selectText: this.institutionFieldNameAAN + ' ' + this.institutionFieldName,
        createNewCallback: createNewFunction,
        searchCallback: searchFunction,
      });
      this.modal.onDidDismiss(data => {
        if (typeof data !== 'undefined') {
          item.institution = data;
          item.institution_id = data.id;
          this.items[index] = item;
        }
        this.modal = undefined;
      });
      this.modal.present();
    }
  }

}
