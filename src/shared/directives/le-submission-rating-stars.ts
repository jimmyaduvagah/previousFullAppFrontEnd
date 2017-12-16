import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'le-submission-rating-stars',
  template: `
    <span *ngIf="stars">
      <ion-icon name="star" *ngFor="let star of starsArray"></ion-icon>
    </span>
  `
})
export class LESubmissionRatingStarsComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  stars: number = null;

  starsArray: number[] = [];

  constructor(
    private _element: ElementRef
  ) {
  }


  ngOnInit() {
    this.starsArray = [];
    let i = 1;
    while (i <= this.stars) {
      this.starsArray.push(i);
      i++;
    }
  }

  ngAfterViewInit() {
  }


  ngOnDestroy() {
  }

}
