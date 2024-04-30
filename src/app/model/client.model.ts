import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ClientModel {
  constructor(private cookieService: CookieService) {}

  private clientIdKey = 'clientId';
  private userKey = 'user';
  private dbNameKey = 'dbName';
  private connectionUrlKey = 'connectionUrl';
  private userNameKey = 'userName';
  private wmsKey = 'wmsKey';
  private tepKey = 'tepKey';
  private sapKey = 'sapKey';

  private getExpirationDate(): Date {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    return expirationDate;
  }

  getClientId(): string {
    return this.cookieService.get(this.clientIdKey) || '';
  }

  setClientId(clientId: string): void {
    const expirationDate = this.getExpirationDate();
    this.cookieService.set(this.clientIdKey, clientId, expirationDate);
  }

  getUser(): string {
    return this.cookieService.get(this.userKey) || '';
  }

  setUser(user: string): void {
    const expirationDate = this.getExpirationDate();
    this.cookieService.set(this.userKey, user, expirationDate);
  }

  getDbName(): string {
    return this.cookieService.get(this.dbNameKey) || '';
  }

  setDbName(dbName: string): void {
    const expirationDate = this.getExpirationDate();
    this.cookieService.set(this.dbNameKey, dbName, expirationDate);
  }

  getConnectionUrl(): string {
    return this.cookieService.get(this.connectionUrlKey) || '';
  }

  setConnectionUrl(connectionUrl: string): void {
    const expirationDate = this.getExpirationDate();
    this.cookieService.set(
      this.connectionUrlKey,
      connectionUrl,
      expirationDate
    );
  }

  getUserName(): string {
    return this.cookieService.get(this.userNameKey) || '';
  }

  setUserName(name: string): void {
    const expirationDate = this.getExpirationDate();
    this.cookieService.set(this.userNameKey, name, expirationDate);
  }

  getWmsKey(): string {
    return this.cookieService.get(this.wmsKey) || '';
  }

  setWmsKey(key: string): void {
    const expirationDate = this.getExpirationDate();
    this.cookieService.set(this.wmsKey, key, expirationDate);
  }

  getTepKey(): string {
    return this.cookieService.get(this.tepKey) || '';
  }

  setTep(key: string): void {
    const expirationDate = this.getExpirationDate();
    this.cookieService.set(this.tepKey, key, expirationDate);
  }

  getSapkey(): string {
    return this.cookieService.get(this.sapKey) || '';
  }

  setSapKey(key: string): void {
    const expirationDate = this.getExpirationDate();
    this.cookieService.set(this.sapKey, key, expirationDate);
  }

  clear(): void {
    this.cookieService.delete(this.clientIdKey);
    this.cookieService.delete(this.userKey);
    this.cookieService.delete(this.dbNameKey);
    this.cookieService.delete(this.connectionUrlKey);
    this.cookieService.delete(this.userNameKey);
    this.cookieService.delete(this.userNameKey);
    this.cookieService.delete(this.userNameKey);
    this.cookieService.delete(this.userNameKey);
  }
}
