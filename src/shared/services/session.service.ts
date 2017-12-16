import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { SettingsService } from './SettingsService';
import { AuthTokenService } from './authtoken.service';
import { User } from '../models/User';
import { NavController } from 'ionic-angular';

@Injectable()
export class SessionService {

    public authStatus: EventEmitter<any> = new EventEmitter();
    public user: User;
    public userObservable: EventEmitter<any> = new EventEmitter();
    public rootNav: NavController;
    private _basePath = 'api-token-auth/';
    private _apiVersion = '1';


    constructor(private _http: Http,
                private _settings: SettingsService,
                private _authToken: AuthTokenService
    ) {
    }

    public getToken() {
        return this._authToken.getToken();
    }

    public logout() {
        let toReturn = this._authToken.clearToken();
        this.actionLoggedOut();
        return toReturn;
    }

    public actionLoggedIn() {
        this.authStatus.emit({
            'authenticated': this.isLoggedIn()
        });
    }

    public actionLoggedOut() {
        this.authStatus.emit({
            'authenticated': this.isLoggedIn()
        });
        this.setUser(undefined);
    }

    public isLoggedIn(): boolean {
        if (this.getToken() != null) {
            return true;
        } else {
            return false;
        }
    }

    public setUser(user: User) {
        this.user = user;
        if (user !== null) {
            this.userObservable.emit(user);
        }
    }

    public notLoggedIn() {
      // this._nav.setRoot(LoginPage);
    }


}
