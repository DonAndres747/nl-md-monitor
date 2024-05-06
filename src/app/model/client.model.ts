import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ClientModel {
  constructor(private cookieService: CookieService) {}

  private clientIdKey = 'clientId';
  private userKey = 'user1';
  private dbNameKey = 'dbName';
  private connectionUrlKey = 'connectionUrl';
  private userNameKey = 'userName1';
  private wmsKey = 'wmsKey';
  private tepKey = 'tepKey';
  private sapKey = 'sapKey';

  private expirationHours = 1;

  private getExpirationDate(): Date {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + this.expirationHours);
    return expirationDate;
  }

  getClientId(): string {
    return this.cookieService.get(this.clientIdKey) || '';
  }

  setClientId(clientId: string): void {
    this.cookieService.set(
      this.clientIdKey,
      clientId,
      this.getExpirationDate()
    );
  }

  getUser(): string {
    return this.cookieService.get(this.userKey) || '';
  }

  setUser(user: string): void {
    this.cookieService.set(this.userKey, user, this.getExpirationDate());
  }

  getDbName(): string {
    return this.cookieService.get(this.dbNameKey) || '';
  }

  setDbName(dbName: string): void {
    this.cookieService.set(this.dbNameKey, dbName, this.getExpirationDate());
  }

  getConnectionUrl(): string {
    return this.cookieService.get(this.connectionUrlKey) || '';
  }

  setConnectionUrl(connectionUrl: string): void {
    this.cookieService.set(
      this.connectionUrlKey,
      connectionUrl,
      this.getExpirationDate()
    );
  }

  getUserName(): string {
    return this.cookieService.get(this.userNameKey) || '';
  }

  setUserName(name: string): void {
    this.cookieService.set(this.userNameKey, name, this.getExpirationDate());
  }

  getWmsKey(): string {
    return this.cookieService.get(this.wmsKey) || '';
  }

  setWmsKey(key: string): void {
    this.cookieService.set(this.wmsKey, key, this.getExpirationDate());
  }

  getTepKey(): string {
    return this.cookieService.get(this.tepKey) || '';
  }

  setTep(key: string): void {
    this.cookieService.set(this.tepKey, key, this.getExpirationDate());
  }

  getSapKey(): string {
    return this.cookieService.get(this.sapKey) || '';
  }

  setSapKey(key: string): void {
    this.cookieService.set(this.sapKey, key, this.getExpirationDate());
  }

  clear(): void {
    this.cookieService.delete(this.clientIdKey);
    this.cookieService.delete(this.userKey);
    this.cookieService.delete(this.dbNameKey);
    this.cookieService.delete(this.connectionUrlKey);
    this.cookieService.delete(this.userNameKey);
    this.cookieService.delete(this.wmsKey);
    this.cookieService.delete(this.tepKey);
    this.cookieService.delete(this.sapKey);
    const allCookies: { [key: string]: string } = this.cookieService.getAll();
    for (const cookieName in allCookies) {
      if (allCookies.hasOwnProperty(cookieName)) {
        this.cookieService.delete(cookieName);
      }
    }
    this.cookieService.deleteAll('/', 'xyz.net');
  }
}
