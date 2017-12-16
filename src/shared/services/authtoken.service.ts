import { Injectable } from '@angular/core';

@Injectable()
export class AuthTokenService {

  constructor() {
    //
  }

  public getToken() {
    let token = window.localStorage.getItem('auth-token');
    if (typeof token === 'undefined') {
      return null;
    } else {
      return token;
    }
  }

  public setToken(token: string) {
    return window.localStorage.setItem('auth-token', token);
  }

  public clearToken() {
    return window.localStorage.removeItem('auth-token');
  }


}
