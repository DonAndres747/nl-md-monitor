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
  id: String = '';
  end1: any = '';
  end2: any = '';
  endName1: any = '';
  endName2: any = '';
  login: String = '';
  service: String = '';
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
          (this.id = response.id),
            (this.end1 = Object.values(response.url)[0]),
            (this.end2 = Object.values(response.url)[1]),
            (this.endName1 = Object.keys(response.url)[0]),
            (this.endName2 = Object.keys(response.url)[1]),
            (this.service = response.service),
            (this.login = response.login);
        });
    });
  }

  updateConnections() {
    this.configService
      .updateConnections(this.solution.toLowerCase(), this.serviceVal, {
        [this.endName1]: this.val1 || this.end1,
        [this.endName2]: this.val2 || this.end2,
      })
      .subscribe((response) => {
        response == 'Success' ? this.refreshRoute() : '';
      });
  }

  active() {
    return !(
      (this.service != this.serviceVal && this.serviceVal != '') ||
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
