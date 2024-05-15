import { Component, OnInit, HostListener } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { ClientModel } from '../model/client.model';
import { WmsService } from '../services/wms_in.service';
import { TepService } from '../services/tep_in.service';
import { SapService } from '../services/sap_in.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, NgxChartsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    private clientModel: ClientModel,
    private wmsService: WmsService,
    private tepService: TepService,
    private sapService: SapService
  ) {}

  name: string = '';
  dbName: string = '';
  wms: string = '';
  tep: string = '';
  sap: string = '';
  transactionsWMS: any[] = [];
  transactionsTEP: any[] = [];
  transactionsSAP: any[] = [];
  pieChartData: any[] = [];
  total: number = 0;

  wmsChart: any[] = [];
  sapChart: any[] = [];
  tepChart: any[] = [];
  isLargeScreen: boolean = false;

  porcentajeAncho: number = 0;
  porcentajeAltura: number = 0;

  view: [number, number] = [0, 0];

  ngOnInit(): void {
    this.name = this.clientModel.getUserName();
    this.dbName = this.clientModel.getDbName();
    this.wms = this.clientModel.getWmsKey();
    this.tep = this.clientModel.getTepKey();
    this.sap = this.clientModel.getSapKey();

    this.getTransactions(this.dbName);

    this.isLargeScreen = window.innerWidth > 1280;
    this.porcentajeAltura = 45;
    this.porcentajeAncho =
      this.tep == 'true' && this.sap == 'true' && this.sap == 'true' ? 20 : 25;
    this.updateView();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateView();

    this.isLargeScreen = window.innerWidth > 1280;
    this.refreshcharts();
  }

  updateView() {
    this.view = [this.calculateWidth(), this.calculateHeight()];
  }

  calculateWidth(): number {
    return window.innerWidth * (this.porcentajeAncho / 100);
  }

  calculateHeight(): number {
    return window.innerHeight * (this.porcentajeAltura / 100);
  }

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [' rgb(0, 38, 58)', 'rgb(178,34,34)', ' rgb(255, 103, 32)'],
  };

  colorScheme2: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['rgb(178,34,34)', ' rgb(0, 38, 58)'],
  };

  async getTransactions(dbName: string) {
    try {
      await this.wmsService.getWmsTrans(dbName).toPromise();
      this.transactionsWMS = [...this.wmsService.transactions];
      const succes = this.transactionsWMS.filter((data) => {
        return data.status == 'OK';
      }).length;

      const fail = this.transactionsWMS.filter((data) => {
        return data.status != 'OK';
      }).length;

      this.wmsChart = [
        {
          name: `Exitosos ${
            this.isLargeScreen
              ? ((succes / this.transactionsWMS.length) * 100).toFixed(0) + '%'
              : ''
          }`,
          value: succes,
        },
        {
          name: `Fallidos ${
            this.isLargeScreen
              ? ((fail / this.transactionsWMS.length) * 100).toFixed(0) + '%'
              : ''
          }`,
          value: fail,
        },
        {
          name: 'Totales',
          value: this.transactionsWMS.length,
        },
      ];
    } catch (error) {
      console.error('Error en obteniendo data WMS:', error);
    }

    try {
      await this.tepService.getTepTrans(dbName).toPromise();
      this.transactionsTEP = [...this.tepService.transactions];

      const succes = this.transactionsTEP.filter((data) => {
        return data.status == 'OK';
      }).length;

      const fail = this.transactionsTEP.filter((data) => {
        return data.status != 'OK';
      }).length;

      this.tepChart = [
        {
          name: `Exitosos ${
            this.isLargeScreen
              ? ((succes / this.transactionsTEP.length) * 100).toFixed(0) + '%'
              : ''
          }`,
          value: succes,
        },
        {
          name: `Fallidos ${
            this.isLargeScreen
              ? ((fail / this.transactionsTEP.length) * 100).toFixed(0) + '%'
              : ''
          }`,
          value: fail,
        },
        {
          name: 'Totales',
          value: this.transactionsTEP.length,
        },
      ];
    } catch (error) {
      console.error('Error en obteniendo data TEP:', error);
    }

    try {
      await this.sapService.getSapTrans(dbName).toPromise();
      this.transactionsSAP = [...this.sapService.transactions];

      const succes = this.transactionsSAP.filter((data) => {
        return data.status == 'OK';
      }).length;

      const fail = this.transactionsSAP.filter((data) => {
        return data.status != 'OK';
      }).length;

      this.sapChart = [
        {
          name: `Exitosos ${
            this.isLargeScreen
              ? ((succes / this.transactionsSAP.length) * 100).toFixed(0) + '%'
              : ''
          }`,
          value: succes,
        },
        {
          name: `Fallidos ${
            this.isLargeScreen
              ? ((fail / this.transactionsSAP.length) * 100).toFixed(0) + '%'
              : ''
          }`,
          value: fail,
        },
        {
          name: 'Totales',
          value: this.transactionsSAP.length,
        },
      ];
    } catch (error) {
      console.error('Error en obteniendo data SAP:', error);
    }

    this.total =
      this.wmsChart[2].value + this.tepChart[2].value + this.sapChart[2].value;

    this.pieChartData = [
      {
        name: `Errados ${(
          ((this.wmsChart[1].value +
            this.tepChart[1].value +
            this.sapChart[1].value) *
            100) /
          this.total
        ).toFixed(2)}%`,
        value:
          this.wmsChart[1].value +
          this.tepChart[1].value +
          this.sapChart[1].value,
      },
      {
        name: `Exitosos ${(
          ((this.wmsChart[0].value +
            this.tepChart[0].value +
            this.sapChart[0].value) *
            100) /
          this.total
        ).toFixed(2)}%`,
        value:
          this.wmsChart[0].value +
          this.tepChart[0].value +
          this.sapChart[0].value,
      },
    ];
  }

  refreshcharts() {
    this.wmsChart = [
      {
        name: `Exitosos ${
          this.isLargeScreen
            ? ((this.wmsChart[0].value / this.wmsChart[2].value) * 100).toFixed(
                0
              ) + '%'
            : ''
        }`,
        value: this.wmsChart[0].value,
      },
      {
        name: `Fallidos ${
          this.isLargeScreen
            ? ((this.wmsChart[1].value / this.wmsChart[2].value) * 100).toFixed(
                0
              ) + '%'
            : ''
        }`,
        value: this.wmsChart[1].value,
      },
      {
        name: 'Totales',
        value: this.wmsChart[2].value,
      },
    ];

    this.tepChart = [
      {
        name: `Exitosos ${
          this.isLargeScreen
            ? ((this.tepChart[0].value / this.tepChart[2].value) * 100).toFixed(
                0
              ) + '%'
            : ''
        }`,
        value: this.tepChart[0].value,
      },
      {
        name: `Fallidos ${
          this.isLargeScreen
            ? ((this.tepChart[1].value / this.tepChart[2].value) * 100).toFixed(
                0
              ) + '%'
            : ''
        }`,
        value: this.tepChart[1].value,
      },
      {
        name: 'Totales',
        value: this.tepChart[2].value,
      },
    ];

    this.sapChart = [
      {
        name: `Exitosos ${
          this.isLargeScreen
            ? ((this.sapChart[0].value / this.sapChart[2].value) * 100).toFixed(
                0
              ) + '%'
            : ''
        }`,
        value: this.sapChart[0].value,
      },
      {
        name: `Fallidos ${
          this.isLargeScreen
            ? ((this.sapChart[1].value / this.sapChart[2].value) * 100).toFixed(
                0
              ) + '%'
            : ''
        }`,
        value: this.sapChart[1].value,
      },
      {
        name: 'Totales',
        value: this.sapChart[2].value,
      },
    ];
  }

  onSelect(a: any) {
    // console.log(a);
  }
}
