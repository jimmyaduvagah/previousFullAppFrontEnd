import { AfterViewInit, Input, OnDestroy, OnInit, Component } from '@angular/core';

@Component({
  selector: 'inline-loading',
  template: `
    <div style="position:absolute; top:50%; width:100%; text-align: center; font-size: 18px">
      <ion-spinner style="width: 20px; height:20px;"></ion-spinner>&nbsp;{{ text }}
    </div>
  `
})
export class InlineLoadingComponent implements OnInit, AfterViewInit, OnDestroy {

  // @Input()
  // autoSetHeight: boolean = false;
  @Input()
  text: string = "Loading...";

  constructor() {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

}
