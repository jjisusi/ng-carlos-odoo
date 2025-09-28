import { Component } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Factura } from './models/Invoice';
import { Catalogo } from './models/catalogo';
import { Producto } from './models/Producto';
import { Update } from './models/Update';
import { NovedadesComponent } from "./components/novedades/novedades.component";
import { FacturaComponent } from './components/factura/factura.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';


@Component({
  selector: 'app-root',
  imports: [CatalogoComponent, FacturaComponent,  NovedadesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'prueba';

  catalogo: Catalogo = new Catalogo([]);
  factura: Factura=new Factura([]);
  updates: Update[] = [];
  inserts: Producto[] = [];
  novedades:Producto[] = [];
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

            const found : Producto | undefined = this.catalogo.productos.find(x => x.Referencia == art.Referencia);

            //to-do : update catalog
            if (!found) {
                const nuevo = new Producto({});
                    nuevo.Referencia = art.Referencia,
                    nuevo.Descripcion= art.Articulo,
                    nuevo.PrecioCoste = art.Precio,
                    nuevo.PrecioVenta = Math.round(art.Precio * 1.20 * 100)/100,
                    nuevo.IVA = art.IVA

                this.updates.push(new Update(nuevo,found));
            }
        }
        for (const art of this.factura.lineas) {
            const found = this.catalogo.productos.find(x => x.Referencia == art.Referencia);

            //to-do : update catalog
            if (found) {
                let hasChanged = false;
                const updated = new Producto({});
                updated.id=found.id;
                updated.Descripcion=found.Descripcion;
                updated.Referencia = found.Referencia;
                updated.PrecioCoste=found.PrecioCoste;
                updated.PrecioVenta = found.PrecioVenta;
                updated.IVA=found.IVA;
                if (found.Descripcion.normalize("NFKD").replace(/[^\x00-\x7F]/g, "") != art.Articulo.normalize("NFKD").replace(/[^\x00-\x7F]/g, "")) {
                    updated.Descripcion = art.Articulo;
                    hasChanged = true;
                }
                if (found.PrecioCoste < art.Precio) {
                    updated.PrecioCoste = art.Precio;
                    updated.PrecioVenta=Math.round(art.Precio * 1.20 * 100)/100;
                    hasChanged = true;
                }
                if (found.IVA != art.IVA) {
                    updated.IVA = art.IVA;
                    hasChanged = true;
                }
                if (hasChanged)
                    this.updates.push(new Update(updated,found));
            }
        }

  }
  isAllChecked(){
    return !this.updates.some(x=>!x.Active);
  }
  checkAll(){
    const checked:boolean = !this.updates.some(x=>!x.Active);
    this.updates.forEach(x=>x.Active=!checked);
  }
  onSelectUpdate(producto:Update){
    producto.Active=!producto.Active; 
  }
  consolidateUpdates(){
        const csv = this.updates.filter(x=>x.Active).map(x=>x.New).toCSV(["id", "Referencia", "Descripcion", "PrecioCoste", "PrecioVenta", "TipoImpuestoVenta","TipoImpuestoCompra"]);
        CSV.download(csv, "toImport.csv");
  }
  procesarNovedades(items:Producto[]){
    this.novedades=[];
      for(const novedad of items){
          if(this.catalogo.Productos.find(x=>x.Referencia==novedad.Referencia)){

          }else{
             this.novedades.push(novedad);
          }
      }
  }
}
class CSV  {

    toJSON() {
        // Papa.parse(this.csv, {
        //     header: true, // Usa la primera fila como claves
        //     skipEmptyLines: true,
        //     complete: function (results) {
        //         lista = results.data;
        //         output.textContent = JSON.stringify(lista, null, 2);
        //     },
        //     error: function (err) {
        //         output.textContent = 'Error al procesar el CSV: ' + err.message;
        //     }
        // });
    }
    public static download=function(csvContent:string, nombreArchivo:String) {
        // 2. Crea un Blob y una URL
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // 3. Crea y simula un clic en el enlace de descarga
        const enlace = document.createElement('a');
        enlace.setAttribute('href', url);
        enlace.setAttribute('download', nombreArchivo + '.csv'); // 4. Asigna el nombre del archivo

        enlace.style.display = 'none'; // Oculta el enlace
        document.body.appendChild(enlace);

        enlace.click(); // 5. Simula el clic

        document.body.removeChild(enlace); // 6. Elimina el enlace
        URL.revokeObjectURL(url); // Libera la URL del objeto
    }
}

