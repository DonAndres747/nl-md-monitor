import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './transaction-details.component.html',
  styleUrl: './transaction-details.component.css',
})
export class TransactionDetailsComponent implements OnInit {
  constructor(private rutaActiva: ActivatedRoute, private http: HttpClient) {}
  id: any = '';
  transaction: any;
  toJson: any;
  interface = '';
  head: any;
  body: any;

  ngOnInit(): void {
    this.rutaActiva.queryParamMap.subscribe((params) => {
      const dataString = params.get('data');
      if (dataString) {
        this.transaction = JSON.parse(dataString);
      }
      this.id = this.transaction.id;
      this.toJson = JSON.parse(this.transaction.toJson);
      this.head = Object.keys(this.toJson)[0];
      this.body = JSON.stringify(this.toJson, null, 2);
    });
  }

  downloadJsonFile() {
    const jsonBlob = new Blob([JSON.stringify(this.toJson, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download =
      'toJson-' +
      this.transaction.interface +
      '-' +
      this.transaction.sequence +
      '.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
