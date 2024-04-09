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

  rutaArchivo = 'prueba.war';
  newContent = 'tres';
  contentLine = 2;

  ngOnInit() {
    this.rutaActiva.paramMap.subscribe((params) => {
      this.solution = params.get('sol')?.toUpperCase();
    });
  }

  updateFile(nuevoContenido: string) {
    this.fileService
      .modificarArchivo(this.rutaArchivo, nuevoContenido, 2)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getWar() {
    this.fileService
      .getWar(this.rutaArchivo, this.newContent, this.contentLine)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
