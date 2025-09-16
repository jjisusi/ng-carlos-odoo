import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Papa } from 'ngx-papaparse';
import { Invoice } from './Invoice';
import { InvoiceLine } from './InvoiceLine';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        this.catalogo = results.data;
        // Aquí puedes usar Angular bindings para mostrar los datos
         const catalogoElement =  document.getElementById("catalogo");
         if(catalogoElement){
           catalogoElement.innerHTML = this.catalogo.toTable();
         }
      },
      error: (err) => {
        console.error('Error al procesar el CSV:', err.message);
      }
    });
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


