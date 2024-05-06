import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { WmsService } from '../services/wms_in.service';
import { SapService } from '../services/sap_in.service';
import { TepService } from '../services/tep_in.service';
import { ClientModel } from '../model/client.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wms',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatIconModule],
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
            this.showDetails(result.result[0].id, 0);
          });
          break;
        case 'TEP':
          this.tepService.getTepTrans(this.dbName).subscribe((result) => {
            result.result.map((transaction: any) => {
              this.transactions.push(transaction);
            });

            this.showDetails(result.result[0].id, 0);
          });
          break;
        case 'SAP':
          this.sapService.getSapTrans(this.dbName).subscribe((result) => {
            result.result.map((transaction: any) => {
              this.transactions.push(transaction);
            });
            this.showDetails(result.result[0].id, 0);
          });
          break;

        default:
          break;
      }
    });
  }

  onChange() {
    this.applyFieldFilter();
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

  applyFieldFilter() {
    if (this.filter) {
      const filtroLower = this.filter.toLowerCase();
      this.filteredTransactions = this.transactions.filter((transaction) =>
        this.camposFiltro.some(
          (field) =>
            transaction[field] &&
            typeof transaction[field] === 'string' &&
            transaction[field].toLowerCase().includes(filtroLower)
        )
      );
    } else {
      this.filteredTransactions = this.transactions;
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
