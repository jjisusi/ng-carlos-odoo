import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Papa } from 'ngx-papaparse';
import { Invoice } from './models/Invoice';
import { InvoiceLine } from './models/InvoiceLine';
import { CatalogoComponent } from './catalogo/catalogo.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CatalogoComponent],
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
  uploadInvoice(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        this.albaran = results.data.map((item: any) => new InvoiceLine(item));
        this.invoice = new Invoice(this.albaran);

        const desgloseElement = document.getElementById("desglose");
        const articlesElement = document.getElementById("articles");

        if (desgloseElement) {
          desgloseElement.innerHTML = this.invoice.Desglose.toTable(["IVA","Importe","Cuota"]);
        }

        if (articlesElement) {
          articlesElement.innerHTML = this.albaran.toTable(["Referencia","Articulo","Cantidad","Precio","Descuento","Importe"]);
        }
      }
    });
  }
  generateUpdates(event: Event){

  }
}


