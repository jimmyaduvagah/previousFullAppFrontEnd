import { ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { InlineLoadingComponent } from './inlineLoading';
import { ImageDirective, ToastImageDirective } from './image';
import { VimeoComponent } from './vimeo';
import { VideoComponent } from './video';
import { LinkDirective } from './link';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LESubmissionRatingStarsComponent } from './le-submission-rating-stars';

@NgModule({
  declarations: [
    InlineLoadingComponent,
    ImageDirective,
    ToastImageDirective,
    VimeoComponent,
    VideoComponent,
    LinkDirective,
    LESubmissionRatingStarsComponent
  ],
  imports: [
    IonicPageModule,
    BrowserAnimationsModule,
  ],
  exports: [
    InlineLoadingComponent,
    ImageDirective,
    ToastImageDirective,
    VimeoComponent,
    VideoComponent,
    LinkDirective,
    LESubmissionRatingStarsComponent
  ],
  bootstrap: [IonicApp],
  entryComponents: [],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class TwzDirectivesModule {
}
