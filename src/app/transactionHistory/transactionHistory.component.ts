import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { WmsService } from '../services/wms_in.service';
import { SapService } from '../services/sap_in.service';
import { TepService } from '../services/tep_in.service';
import { ClientModel } from '../model/client.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YY',
  },
  display: {
    dateInput: 'DD/MM/YY',
    monthYearLabel: 'MM/YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM/YYYY',
  },
};

@Component({
  selector: 'app-wms',
  standalone: true,
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './transactionHistory.component.html',
  styleUrl: './transactionHistory.component.css',
})
export class transactionComponent implements OnInit {
  constructor(
    private router: Router,
    private wmsService: WmsService,
    private tepService: TepService,
    private sapService: SapService,
    private clientModel: ClientModel,
    private rutaActiva: ActivatedRoute
  ) {}

  solution: any;
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  camposFiltro: string[] = ['sequence', 'interface', 'fromHost', 'status'];
  @Input() filter: string = '';
  dbName: string = '';
  selectedTransaction: any;
  selected: number = -1;
  @ViewChild('picker') picker!: MatDatepicker<any>;
  @ViewChild('picker2') picker2!: MatDatepicker<any>;
  startDate: any = null;
  endDate: any = null;

  ngOnInit(): void {
    this.rutaActiva.paramMap.subscribe((params) => {
      this.solution = params.get('sol')?.toUpperCase();
      this.dbName = this.clientModel.getDbName();
      this.transactions = [];
      switch (this.solution) {
        case 'WMS':
          this.wmsService.getWmsTrans(this.dbName).subscribe((result) => {
            result.result.map((transaction: any) => {
              this.transactions.push(transaction);
            });
            result.result[0]
              ? this.showDetails(result.result[0].id, 0)
              : (this.filteredTransactions = []);
          });
          break;
        case 'TEP':
          this.tepService.getTepTrans(this.dbName).subscribe((result) => {
            result.result.map((transaction: any) => {
              this.transactions.push(transaction);
            });
            result.result[0]
              ? this.showDetails(result.result[0].id, 0)
              : (this.filteredTransactions = []);
          });
          break;
        case 'SAP':
          this.sapService.getSapTrans(this.dbName).subscribe((result) => {
            result.result.map((transaction: any) => {
              this.transactions.push(transaction);
            });
            result.result[0]
              ? this.showDetails(result.result[0].id, 0)
              : (this.filteredTransactions = []);
          });
          break;
        default:
          break;
      }
    });
  } 

  async showDetails(id: string, index: number) {
    await this.applyFieldFilter();
    this.selectedTransaction = this.filteredTransactions[index];
    this.selected = index;
    this.router.navigate(
      [`/main/transactions/${this.solution.toLowerCase()}/${id}`],
      {
        queryParams: { data: JSON.stringify(this.selectedTransaction) },
        skipLocationChange: true,
      }
    );
  }

  handleDatesPicker() {
    !this.startDate && !this.endDate
      ? this.pickDatesFilter()
      : this.clearDates();
  }

  pickDatesFilter() {
    this.picker.open();
    this.picker.closedStream.subscribe(() => {
      if (this.picker2) {
        this.picker2.open();
        this.picker2.closedStream.subscribe(() => {
          this.startDate = this.picker.startAt ? this.picker.startAt._d : null;
          this.endDate = this.picker2.startAt
            ? this.picker2.startAt._d
            : this.picker.startAt
            ? new Date(new Date().getFullYear(), 11, 31)
            : null;

          if (this.startDate > this.endDate) {
            const newEnd = this.startDate;
            this.startDate = this.endDate;
            this.endDate = newEnd;
          } else if (this.endDate && !this.startDate) {
            this.startDate = this.picker2.startAt._d;
            this.endDate = new Date(new Date().getFullYear(), 11, 31);
          }
          this.datesFilter();
        });
      }
    });
  }

  datesFilter() {
    if (this.startDate && this.endDate) {
      this.filteredTransactions = this.filteredTransactions.filter(
        (transaction) => {
          return (
            new Date(transaction.recordDate) >=
              this.startDate.setHours(0, 0, 0, 0) &&
            new Date(transaction.recordDate) <=
              this.endDate.setHours(23, 59, 59, 999)
          );
        }
      );
    } else {
      this.filteredTransactions = this.transactions;
      this.filter ? this.applyFieldFilter() : '';
    }
  }

  clearDates() {
    this.startDate = null;
    this.endDate = null;
    this.datesFilter();
  }

  clearStringFilter() {
    this.filter = '';
    this.applyFieldFilter();
  }

  applyFieldFilter() {
    if (this.filter) {
      const filtroLower = this.filter.toLowerCase();
      this.filteredTransactions = this.filteredTransactions.filter(
        (transaction) =>
          this.camposFiltro.some(
            (field) =>
              transaction[field] &&
              typeof transaction[field] === 'string' &&
              transaction[field].toLowerCase().includes(filtroLower)
          )
      );
    } else {
      this.filteredTransactions = this.transactions;
      this.startDate ? this.datesFilter() : '';
    }
  }

  isSelected(index: number) {
    return this.selected == index;
  }

  getFormattedDate(date: any) {
    const trans = {
      recordDate: new Date(date),
    };

    return trans.recordDate.toLocaleString('Es-es', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }
}
