import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { LearningExperienceImage } from "../../shared/models/LearningExperience";

@Component({
  selector: 'page-image-view',
  templateUrl: 'image-view.html'
})
export class ImageViewPage implements OnDestroy {

  public image: LearningExperienceImage;
  public imageSrc: string;
  private windowListenerFunction;


  constructor(public statusBar: StatusBar,
              public _nav: NavController,
              public _viewCtrl: ViewController,
              public _navParams: NavParams,
  ) {

    this.statusBar.hide();
    this.windowListenerFunction = ()=>{
      this.statusBar.hide();
    };
    document.addEventListener('resume',this.windowListenerFunction);

    let imageSrc = this._navParams.get('imageSrc');
    let image = this._navParams.get('image');
    if (imageSrc !== null && typeof imageSrc !== 'undefined') {
      this.imageSrc = imageSrc;
    }
    if (image !== null && typeof image !== 'undefined') {
      this.image = image;
    }

    if (typeof this.image !== 'undefined') {
      this.imageSrc = this.image.src;
    }
  }

  close() {
    this._viewCtrl.dismiss({});
  }

  ngOnDestroy() {
    this.statusBar.show();
    document.removeEventListener('resume',this.windowListenerFunction);
  }

}
