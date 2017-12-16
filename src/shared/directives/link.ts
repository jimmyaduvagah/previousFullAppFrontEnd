import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

@Directive({
  selector: 'a'
})
export class LinkDirective implements OnInit, AfterViewInit, OnDestroy {

  options: InAppBrowserOptions = {
    location: 'no',
    shouldPauseOnSuspend: 'yes',
    disallowoverscroll: 'yes',
    toolbar: 'yes',
    enableViewportScale: 'yes',
    allowInlineMediaPlayback: 'yes',
    presentationstyle: 'pagesheet',
    transitionstyle: 'crossdissolve'
  };

  constructor(
    private _element: ElementRef,
    private _iab: InAppBrowser
  ) {
  }

  @HostListener('tap', ['$event'])

  onTap($event) {
    this.launchInAppBrowser(this._element.nativeElement.getAttribute('href'));
    let touchEvent: TouchEvent = <TouchEvent>$event.srcEvent;
    touchEvent.preventDefault();
    touchEvent.stopPropagation();
    $event.returnValue = false;
    return false;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // console.log('link', this._element.nativeElement.getAttribute('href'));
  }


  ngOnDestroy() {
  }

  launchInAppBrowser(url) {
    this._iab.create(url, '_blank', this.options);
  }

}
