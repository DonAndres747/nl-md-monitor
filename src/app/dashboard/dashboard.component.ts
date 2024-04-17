import { Component, OnInit } from '@angular/core';
import { ClientModel } from '../model/client.model';
import { WmsService } from '../services/wms_in.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    private clientModel: ClientModel,
    private wmsService: WmsService
  ) {}
  
  name: string = '';
  transactions: any[] = [];

  ngOnInit(): void {
    this.name = this.clientModel.getUserName();

    this.getWmstransactions();
  }

  async getWmstransactions() { 

    await this.wmsService.getWmsTrans('consenso').subscribe(() => {
      this.transactions = [...this.wmsService.transactions]; 
    });
  }
}
