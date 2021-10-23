import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private DB = localStorage;
  private tokenID = 'access-token';

  constructor() { }

  getAccessToken(): string {
    return this.DB.getItem(this.tokenID);
  }

  updateAccessToken(token: string) {
    this.DB.setItem(this.tokenID, token);
  }

  clearAccessToken() {
    this.DB.removeItem(this.tokenID);
  }

  isLoggedIn() {
    return this.getAccessToken() !== null;
  }
}
