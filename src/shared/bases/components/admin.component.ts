
import { SessionService } from '../../services/session.service';
import { AuthenticatedComponent, OnAuthenticated } from './authenticated.component';
import { NavController, AlertController, App } from 'ionic-angular';
import { HomePage } from '../../../pages/home/home';
import { AccessDenied } from "../../../desktop/pages/access_denied/access_denied";
import { MainTabs } from "../../../pages/main-tabs/main-tabs";


export declare abstract class OnAdminAuthenticated {
    abstract OnAdminAuthenticated(): void;
}

export class AdminComponent extends AuthenticatedComponent implements OnAuthenticated, OnAdminAuthenticated {

    public isAuthenticated: boolean = false;

    constructor(
        public _nav: NavController,
        public _sessionService: SessionService,
        public _alertCtrl: AlertController,
        public _app: App,
    ) {
        super(_nav, _sessionService);
        return;
        //
    }

    OnAuthenticated() {
        if (this._sessionService.user.userprofile.is_admin || this._sessionService.user.is_staff ) {
            this.OnAdminAuthenticated();
        } else {
            let alert = this._alertCtrl.create({
              title: 'Access Denied',
              subTitle: 'You are not allowed to access this page',
              buttons: ['Dismiss']
            });
            alert.present();
            this._app.getRootNav().setRoot(MainTabs);

        }
    }

    OnAdminAuthenticated() {
        //
    }


}
