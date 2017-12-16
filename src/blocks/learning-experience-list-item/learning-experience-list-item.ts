import { Component, AfterViewInit, Input, OnInit, ElementRef, AfterContentChecked } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LearningExperience } from '../../shared/models/LearningExperience';


@Component({
  selector: 'learning-experience-list-item',
  templateUrl: 'learning-experience-list-item.html'
})
export class LearningExperienceListItemComponent implements AfterViewInit, OnInit, AfterContentChecked {

  @Input()
  public item: LearningExperience;

  @Input()
  public localImage: boolean = false;

  private height: number;
  private width: number;
  private firstCheck: boolean = true;



  constructor(
    private _nav: NavController,
    private _element: ElementRef
  ) {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngAfterContentChecked() {
    // this fires every tick!  At least now we just check a boolean every tick and not calculate the height...
    if (this.firstCheck) {
      console.log(this.item);
      this.setHeight();
      this.firstCheck = false;
    }
  }

  setHeight() {
    this.width = this._element.nativeElement.children[0].offsetWidth;
    this.height = this.item.image.height * this.width / this.item.image.width;
  }

}
