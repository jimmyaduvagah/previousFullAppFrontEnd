import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IPushMessage } from '@ionic/cloud-angular';
import { PUSH_NOTIFICATION_TYPES } from '../constant/push-notification-types';
import { PostDetailPage } from '../../pages/post-detail/post-detail';
import { ContactsPage } from '../../pages/contacts/contacts';
import { ProfilePage } from '../../pages/profile/profile';

@Injectable()

export class NotificaionRoutingService {

  private _navCtrl;
  constructor() {
    //
  }
  setup(navCtrl: NavController) {
    this._navCtrl = navCtrl;
  }

  routeTo(nativeNotification: IPushMessage) {
    switch (nativeNotification.payload['type']) {
      case PUSH_NOTIFICATION_TYPES.CONNECTION_REQUEST:
        this._navCtrl.push(ProfilePage, {
          userId: nativeNotification.payload['created_by_id']
        });
        break;
      case PUSH_NOTIFICATION_TYPES.CONNECTION_REQUEST_APPROVED:
        this._navCtrl.push(ProfilePage, {
          userId: nativeNotification.payload['created_by_id']
        });
        break;
      case PUSH_NOTIFICATION_TYPES.NEW_COMMENT:
      case PUSH_NOTIFICATION_TYPES.NEW_LIKE:
      case PUSH_NOTIFICATION_TYPES.NEW_POST:
        this._navCtrl.push(PostDetailPage, {
          postId: nativeNotification.payload['post_id']
        });
        break;
    }

  }


}
