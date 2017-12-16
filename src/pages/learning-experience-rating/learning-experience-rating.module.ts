import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LearningExperienceRatingPage } from './learning-experience-rating';
import { ReviewService } from '../../shared/services/review.service';
import { ElasticModule } from 'ng-elastic';

@NgModule({
  declarations: [
    LearningExperienceRatingPage,
  ],
  imports: [
    ElasticModule,
    IonicPageModule.forChild(LearningExperienceRatingPage),
  ],
  exports: [
    LearningExperienceRatingPage
  ]
})
export class LearningExperienceRatingPageModule {}
