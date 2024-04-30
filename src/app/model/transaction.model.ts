import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class transactionModel {
  private id: string = '';
  private sequence: string = '';
  private interface: string = '';
  private fromJson: string = '';
  private toJson: string = '';
  private status: string = '';
  private recordDate: string = '';
  private fromHost: string = '';
  private toHost: string = '';
  private message: string = '';

  constructor() {}

  initialize(transaction: any) {
    this.id = transaction.id || '';
    this.sequence = transaction.sequence || '';
    this.interface = transaction.interface || '';
    this.fromJson = transaction.fromJson || '';
    this.toJson = transaction.toJson || '';
    this.status = transaction.status || '';
    this.recordDate = transaction.recordDate || '';
    this.fromHost = transaction.fromHost || '';
    this.message = transaction.message || '';
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getSequence(): string {
    return this.sequence;
  }

  setSequence(sequence: string): void {
    this.sequence = sequence;
  }

  getInterface(): string {
    return this.interface;
  }

  setInterface(interfaceValue: string): void {
    this.interface = interfaceValue;
  }

  getFromJson(): string {
    return this.fromJson;
  }

  setFromJson(fromJson: string): void {
    this.fromJson = fromJson;
  }

  getToJson(): string {
    return this.toJson;
  }

  setToJson(toJson: string): void {
    this.toJson = toJson;
  }

  getStatus(): string {
    return this.status;
  }

  setStatus(status: string): void {
    this.status = status;
  }

  getRecordDate(): string | null {
    return this.recordDate;
  }

  setRecordDate(recordDate: string): void {
    this.recordDate = recordDate;
  }

  getFromHost(): string {
    return this.fromHost;
  }

  setFromHost(fromHost: string): void {
    this.fromHost = fromHost;
  }

  getToHost(): string {
    return this.toHost;
  }

  setToHost(toHost: string): void {
    this.toHost = toHost;
  }

  getMessage(): string {
    return this.message;
  }

  setMessage(message: string): void {
    this.message = message;
  }
}
