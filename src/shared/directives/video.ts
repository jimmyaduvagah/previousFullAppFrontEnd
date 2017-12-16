import {
  Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2,
  ViewChild
} from "@angular/core";

@Component({
  selector: '[ng-video]',
  inputs: ['link', 'poster'],
  template: `
    <div *ngIf="poster" class="poster-overlay" (click)="playVideo()" [class.playing]="isPlaying">
      <img src="{{ poster }}">
      <i class="icon icon-youtube-with-circle"></i>
      <!--<i class="icon icon-circle"></i>-->
    </div>
  `,
  providers: [],
  styles: [`
    .poster-overlay {
      position: absolute;
      /*visibility: visible;*/
      display: none;
      width: 100%;
      z-index: 150;
      opacity: 1;
      cursor: pointer;
    }

    .poster-overlay.playing {
      display: none;
      opacity: 0;
      transition: .5s;
      cursor: default;
    }

    .poster-overlay .icon {
      position: absolute;
      top: 44%;
      left: 0;
      font-size: 700%;
      text-align: center;
      width: 100%;
      color: #cccccc;
      opacity: .75;
      text-shadow: 2px 2px 2px rgba(0, 0, 0, .25);
    }

    .poster-overlay .icon-circle {
      font-size: 700%;
      top: 45%;
    }

    .poster-overlay:hover .icon {
      color: #cc1543;
      opacity: 1;
    }`]
})

export class VideoComponent implements OnInit, OnDestroy {

  @ViewChild('player_1')
  private player;
  private player_id = 'player_';

  @Input('link')
  public link: string;

  @Input('poster')
  public poster: string;

  @Input('startFromSeconds')
  public startFromSeconds: string = '';

  @Input('play')
  public play: EventEmitter<any> = new EventEmitter();

  public params: string;

  @Output('onPlay')
  public onPlayEmitter: EventEmitter<any> = new EventEmitter();
  @Output('onPause')
  public onPauseEmitter: EventEmitter<any> = new EventEmitter();
  @Output('onEnd')
  public onEndEmitter: EventEmitter<any> = new EventEmitter();
  @Output('onPlaybackProgress')
  public onPlaybackProgressEmitter: EventEmitter<any> = new EventEmitter();

  private messageListener: Function = () => {
  };

  private isPlaying = false;

  constructor(public _elementRef: ElementRef,
              private _renderer: Renderer2) {
    this.player_id = 'player_' + (Math.random().toString().replace('.', ''));
    this.params = 'title=0&byline=0&portrait=0&api=1&player_id=' + this.player_id;
  }

  ngOnInit() {
    this.setUpVideoEventListener();
    this.play.subscribe(() => {
      this.postToPlayer('play', '');
    })
  }

  // We're using bootstrap's CSS class for responsive embedding
  // leaving it here in case we want to do something else...
  // add (window:resize)="onResize($event)" and (load)="onResize($event)" to the element if we want it back.
  // onResize(event) {
  //     if (this._elementRef.nativeElement.children.length > 0) {
  //         if (this._elementRef.nativeElement.children[0].children.length > 0) {
  //             var width = this._elementRef.nativeElement.children[0].children[0].offsetWidth;
  //             var height = Math.ceil((width * 9) / 16);
  //             this._elementRef.nativeElement.children[0].children[0].style.height = height+'px';
  //         }
  //     }
  // }


  ngOnDestroy() {
    this.messageListener();
  }

  setUpVideoEventListener() {
    this.messageListener = this._renderer.listen('window', 'message', this.handleVideoEvent());
  }

  handleVideoEvent() {
    return (event) => {
      var data = JSON.parse(event.data);
      if (data.player_id == this.player_id) {
        switch (data.event) {
          case 'ready':
            this.playerOnReady();
            if (parseFloat(this.startFromSeconds) > 0) {
              this.postToPlayer('seekTo', this.startFromSeconds);
              this.postToPlayer('pause', '');
            }

            break;

          case 'playProgress':
            this.playerOnPlayProgress(data.data);
            break;

          case 'play':
            this.playerOnPlay();
            break;

          case 'pause':
            this.playerOnPause();
            break;

          case 'finish':
            this.playerOnFinish();
            break;
        }
      }
    }

  }

  playVideo() {
    this.play.emit(true);
  }

  playerOnReady() {
    this.postToPlayer('addEventListener', 'play');
    this.postToPlayer('addEventListener', 'pause');
    this.postToPlayer('addEventListener', 'finish');
    this.postToPlayer('addEventListener', 'playProgress');
  }

  playerOnPlayProgress(data) {
    this.onPlaybackProgressEmitter.emit(data);
    this.isPlaying = true;
  }

  playerOnPlay() {
    this.onPlayEmitter.emit(true);
    this.isPlaying = true;
  }

  playerOnPause() {
    this.onPauseEmitter.emit(true);
  }

  playerOnFinish() {
    this.onEndEmitter.emit(true);
    this.isPlaying = false;
  }

  postToPlayer(action, value) {
    var data = {
      method: action
    };

    if (value) {
      data['value'] = value;
    }

    var message = JSON.stringify(data);
    this.player.nativeElement.contentWindow.postMessage(message, '*');
  }

}
