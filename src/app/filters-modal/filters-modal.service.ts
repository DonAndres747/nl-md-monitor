import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FiltersModalComponent } from './filters-modal.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private currentDataSubject = new BehaviorSubject<any[]>([]);
  public currentData = this.currentDataSubject.asObservable();
  constructor(private dialog: MatDialog) {}

  openModal(data: any[]) {
    this.currentDataSubject.next(data); // Enviar los datos al componente modal
    const dialogRef = this.dialog.open(FiltersModalComponent, {
      width: 'max-content',
      panelClass: 'custom-modal',
    });

    return dialogRef;
  }

  closeModal(): void {
    const dialogRef = this.dialog.closeAll();
  }
}
