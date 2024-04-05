import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
})
export class ConfigComponent implements OnInit {
  constructor(
    private rutaActiva: ActivatedRoute,
    private fileService: FileService
  ) {}

  solution: any;

  rutaArchivo =
    'C:/Users/AndresFelipeGiraldoB/Documents/Proyecto visual/MiddleWare monitor/MD-monitor/prueba.txt';

  ngOnInit() {
    this.rutaActiva.paramMap.subscribe((params) => {
      this.solution = params.get('sol');
    });
  }

  modificarArchivo(nuevoContenido: string) { 
    this.fileService
      .modificarArchivo(this.rutaArchivo, nuevoContenido, 3)
      .subscribe(
        (response) => {
          // console.log(response);
        },
        (error) => {
          // console.error(error);
        }
      );
  }
}
