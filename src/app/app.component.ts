import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Papa } from 'ngx-papaparse';
import { Factura } from './models/Invoice';
import { FacturaLinea } from './models/InvoiceLine';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { FacturaComponent } from "./factura/factura.component";
import { Catalogo } from './models/catalogo';
import { Producto } from './models/Producto';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CatalogoComponent, FacturaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'prueba';

  catalogo: Catalogo = new Catalogo([]);
  factura: Factura=new Factura([]);
  updates: Producto[] = [];
  inserts: Producto[] = [];

  constructor(private papa: Papa) {
    const csvData = '"Hello","World!"';

    this.papa.parse(csvData, {
      complete: (result) => {
        console.log('Parsed: ', result);
      }
    });
  }
  onCatalogUploaded(catalogo:Catalogo): void {
    this.catalogo=catalogo;
    if(this.factura.lineas.length){
      this.generateUpdates();
    }
  }
  onInvoiceUploaded(factura:Factura): void {
    this.factura=factura;
    if(this.catalogo.productos.length){
      this.generateUpdates();
    }
  }
  generateUpdates(){
        this.updates = [];
        for (const art of this.factura.lineas) {

            const found = this.catalogo.productos.find(x => x.Referencia == art.Referencia);

            //to-do : update catalog
            if (!found) {
                const nuevo = new Producto({});
                    nuevo.Referencia = art.Referencia,
                    nuevo.Descripcion= art.Articulo,
                    nuevo.PrecioCoste = art.Precio,
                    nuevo.PrecioVenta = art.Precio * 1.20,
                    nuevo.IVA = art.IVA

                this.updates.push(nuevo);
            }
        }
        for (const art of this.factura.lineas) {
            const found = this.catalogo.productos.find(x => x.Referencia == art.Referencia);

            //to-do : update catalog
            if (found) {
                let hasChanged = false;
                const updated = new Producto({});
                updated.Descripcion=found.Descripcion;
                updated.Referencia = found.Referencia;
                updated.PrecioCoste=found.PrecioCoste;
                updated.PrecioVenta = found.PrecioVenta;
                updated.IVA=found.IVA;
                if (found.Descripcion.normalize("NFKD").replace(/[^\x00-\x7F]/g, "") != art.Articulo.normalize("NFKD").replace(/[^\x00-\x7F]/g, "")) {
                    // updated.last_name = "<b>" + updated.Nombre + "</b>"
                    updated.Descripcion = art.Articulo;
                    hasChanged = true;
                    //console.log("Cambio en nombre " + updated.Nombre + " --- " + updated.last_name);
                }
                // updated.UltimoPrecio = updated.PrecioCoste;
                // updated.UltimoPrecioVenta = updated.PrecioVenta;
                if (found.PrecioCoste < art.Precio) {
                    // updated.UltimoPrecio = "<b>" + updated.PrecioCoste + "</b>";
                    // updated.UltimoPrecioVenta = "<b>" + updated.UltimoPrecioVenta + "</b>";
                    updated.PrecioCoste = art.Precio;
                    updated.PrecioVenta=art.Precio*1.20;
                    hasChanged = true;
                    //console.log("Cambio en PrecioCoste " + updated.Descripcion + " de " + updated.last_price + " a " + art.PrecioCoste);
                }
                if (found.IVA != art.IVA) {
                    // updated.UltimoIVA = updated["IVA"];
                    updated.IVA = art.IVA;
                    // updated["TipoImpuestoCompra"] = art.TipoImpuestoCompra;
                    hasChanged = true;
                    //console.log("Cambio en impuesto " + updated.Nombre + " de " + updated.UltimoIVA + " a " + art.IVA);
                } else {
                    //updated["TipoImpuestoCompra"] = art.TipoImpuestoCompra;
                }
                if (hasChanged)
                    this.updates.push(updated);
            }
        }

  }
}


