import { Component, OnInit, SimpleChanges } from '@angular/core';
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

  tepIntData: any[] = [];

  ngOnInit() {
    this.rutaActiva.paramMap.subscribe((params) => {
      this.solution = params.get('sol')?.toUpperCase();
      this.dbName = this.clienModel.getDbName();
      this.clearinputs();
      this.configService
        .getConnectionsUrls(this.dbName, this.solution.toLowerCase())
        .subscribe((response) => {
          (this.id = response.id),
            (this.service = response.service),
            (this.login = response.login),
            this.solution != 'TEP'
              ? ((this.end1 = Object.values(response.url)[0]),
                (this.end2 = Object.values(response.url)[1]),
                (this.endName1 = Object.keys(response.url)[0]),
                (this.endName2 = Object.keys(response.url)[1]))
              : Object.entries(response.url).map(([key, value]) => {
                  this.tepIntData.push({
                    name: key,
                    currentValue: value,
                    newValue: '',
                  });
                });
        });
    });
  }

  updateConnections() {
    let dataToSend: any;

    if (this.solution !== 'TEP') {
      dataToSend = {
        [this.endName1]: this.val1 || this.end1,
        [this.endName2]: this.val2 || this.end2,
      };
    } else {
      const tepData: any = {};
      this.tepIntData.forEach((value) => {
        tepData[value.name] = value.newValue || value.currentValue;
      });
      dataToSend = tepData;
    }

    this.configService
      .updateConnections(
        this.solution.toLowerCase(),
        this.serviceVal,
        dataToSend
      )
      .subscribe((response) => {
        response === 'Success' ? this.refreshRoute() : '';
      });
  }

  active() {
    if (this.solution != 'TEP') {
      return !(
        (this.service != this.serviceVal && this.serviceVal != '') ||
        (this.end1 != this.val1 && this.val1 != '') ||
        (this.end2 != this.val2 && this.val2 != '')
      );
    } else {
      return !(
        (this.service != this.serviceVal && this.serviceVal != '') ||
        this.tepIntData.filter((data) => {
          return data.newValue != '';
        }).length > 0
      );
    }
  }

  clearinputs() {
    this.val1 = '';
    this.val2 = '';
    this.serviceVal = '';
    this.solution == 'TEP'
      ? this.tepIntData.forEach((element) => {
          element.newValue = '';
        })
      : '';
  }

  refreshRoute() {
    alert('URL actualizada con exito');
    window.location.reload();
  }

  capitalizeFirstLetter(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
