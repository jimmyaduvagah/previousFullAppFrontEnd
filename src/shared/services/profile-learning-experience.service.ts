import { Injectable } from '@angular/core';
import { LearningExperienceService } from './learning-experience.service';

@Injectable()

export class ProfileLearningExperienceService extends LearningExperienceService {
  // ugh this seems dirty... need a separate service so the profile doesn't update the main listObject and
  // break infinite scrolling on the LE List Page.

}
