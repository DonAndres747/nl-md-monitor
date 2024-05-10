import { Component, Input, Output, OnInit, input } from '@angular/core';
import { ModalService } from './filters-modal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class FiltersModalComponent implements OnInit {
  constructor(
    private modalService: ModalService,
    public dialogRef: MatDialogRef<FiltersModalComponent>
  ) {}

  status = '';
  interface = '';
  sequence = '';
  fromHost = '';
  @Input() transactions: any[] = [];

  ngOnInit(): void {
    this.modalService.currentData.subscribe((data) => {
      this.transactions = data;
    });
  }

  cerrarModal(): void {
    this.modalService.closeModal();
  }

  applyFieldFilter(filters: { [key: string]: string }) {
    this.dialogRef.close(filters);
  }

  enableApply() {
    return (
      this.status != '' ||
      this.interface != '' ||
      this.sequence != '' ||
      this.fromHost
    );
  }
}
