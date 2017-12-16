import { TWToastController } from './tw-toast-controller';
import { TWToastCmp } from './tw-toast-cmp';
import { IonicModule } from 'ionic-angular';
import { MyApp } from '../../../app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ImageModule } from '../../directives/image.module';
import { TwzDirectivesModule } from '../../directives/twzDirectives.module';

@NgModule({
  declarations: [
    TWToastCmp,
  ],
  imports: [
    BrowserAnimationsModule,
    TwzDirectivesModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md',
    }),
  ],
  entryComponents: [
    TWToastCmp,

  ],
  providers: [
    TWToastController
  ]
})
export class TwToastModule {
}
