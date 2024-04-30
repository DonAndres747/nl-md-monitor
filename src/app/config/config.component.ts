import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { ClientModel } from '../model/client.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
})
export class ConfigComponent implements OnInit {
  constructor(
    private rutaActiva: ActivatedRoute,
    private configService: ConfigService,
    private clienModel: ClientModel
  ) {}

  solution: any;
  serviceUrl: String = '';
  end1: String = '';
  end2: String = '';
  dbName: any;
  serviceVal: string = '';
  val1: string = '';
  val2: string = '';

  ngOnInit() {
    this.rutaActiva.paramMap.subscribe((params) => {
      this.solution = params.get('sol')?.toUpperCase();
      this.dbName = this.clienModel.getDbName();
      this.clearinputs();
      this.configService
        .getConnectionsUrls(this.dbName, this.solution.toLowerCase())
        .subscribe((response) => {
          this.end1 = response.tep;
          this.end2 = this.solution == 'WMS' ? response.sap : response.wms;
          this.serviceUrl = response.service;
        });
    });
  }

  updateConnections() {
    this.configService
      .updateConnections(
        this.solution.toLowerCase(),
        'tep',
        this.solution == 'WMS' ? 'sap' : 'wms',
        this.serviceVal,
        this.val1, //valor a setear en tep
        this.val2 //valor a setear en wms o sap dependiendo de solution,
      )
      .subscribe((response) => {
        console.log(response);

        response == 'Success' ? this.refreshRoute() : '';
      });
  }

  active() {
    return !(
      (this.serviceUrl != this.serviceVal && this.serviceVal != '') ||
      (this.end1 != this.val1 && this.val1 != '') ||
      (this.end2 != this.val2 && this.val2 != '')
    );
  }

  clearinputs() {
    this.val1 = '';
    this.val2 = '';
    this.serviceVal = '';
  }

  refreshRoute() {
    alert('URL actualizada con exito'); 
    window.location.reload();
  }
}
