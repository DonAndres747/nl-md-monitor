import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { ClientModel } from '../model/client.model';

@Component({
  selector: 'app-config',
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
  tepEP: String = '';
  sapEP: String = '';
  dbName: any;

  ngOnInit() {
    this.rutaActiva.paramMap.subscribe((params) => {
      this.solution = params.get('sol')?.toUpperCase();
      this.dbName = this.clienModel.getDbName();

      this.configService
        .getConnectionsUrls(this.dbName, this.solution.toLowerCase())
        .subscribe((response) => {
          console.log(response);
          this.tepEP = response.tep;
          this.sapEP = response.sap;
          this.serviceUrl = response.service;
        });
    });
  }
}
