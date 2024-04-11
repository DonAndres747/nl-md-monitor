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

  rutaArchivo = 'C:/Users/andre/OneDrive/Escritorio/a/pr/pruebaotropc.war';
  newContent = 'tres';
  contentLine = 2;

  ngOnInit() {
    this.rutaActiva.paramMap.subscribe((params) => {
      this.solution = params.get('sol')?.toUpperCase();
    });
  }

  updateProp() {
    this.fileService
      .updateProp(this.rutaArchivo, this.newContent, this.contentLine)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  async getFile() {
    try { 
      const [handle] = await (window as any).showOpenFilePicker();
      const file: File = await handle.getFile();
 
      const contenido: string = await file.text(); 
      console.log(contenido);
    } catch (error) {
      console.error('Error al leer el archivo:', error);
    }
  }
}
