import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Papa } from 'ngx-papaparse';
import { Factura } from './models/Invoice';
import { FacturaLinea } from './models/InvoiceLine';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { FacturaComponent } from "./factura/factura.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CatalogoComponent, FacturaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'prueba';

  catalogo: any[] = [];
  albaran: any[] = [];
  invoice: any;
  updates: any[] = [];

  constructor(private papa: Papa) {
    const csvData = '"Hello","World!"';

    this.papa.parse(csvData, {
      complete: (result) => {
        console.log('Parsed: ', result);
      }
    });
  }
  uploadCatalog(event: Event): void {

  }

  generateUpdates(event: Event){

  }
}


