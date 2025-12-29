import { Component, output } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Factura } from '../../models/Invoice';
import { FacturaLinea } from '../../models/InvoiceLine';
import { OcrService } from '../../services/ocr.service';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-factura',
  imports: [TableModule],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.scss'
})
export class FacturaComponent {
  factura: Factura = new Factura([]);
  uploaded = output<Factura>();
  constructor(
    private papa: Papa,
    private messages:MessageService,
    private ocrService: OcrService
  ) {
  }

async uploadInvoicePdf(event: Event) {
  
    const input = event.target as HTMLInputElement;
    const txtInvoice = document.getElementById("txtInvoice") as HTMLInputElement;
    if (!input.files) return;
    this.ocrService.uploadInvoice(input.files[0]).subscribe({
      next:(data)=>{
        txtInvoice.innerHTML += data;
      },
      error:()=>{
          this.messages.add({ 
            severity: 'error', 
            detail: "Error al subir factura productos. Consulte al servicio técnico de IsusiSoft" 
          });
      }
    })
  }
  updateProduct(){
    this.uploaded.emit(this.factura);
  }

  uploadInvoiceFromText() {
    const txtInvoice = document.getElementById("txtInvoice") as HTMLInputElement;
    let text = txtInvoice.value;

    const albaran = [];
    for (const item of this.extraerProductos(text)) {
      const line = new FacturaLinea(item);
      albaran.push(item);
    }
    this.factura = new Factura(albaran);
    this.uploaded.emit(this.factura);
  }
  extraerProductos(texto:string) {

        const patronesExcluidos = [
            /PAGO AL CONTADO/,
            /^Dto\.?$/i,
            /CARLOS VILLEGAS ARRANZ/,
            /CTRA\. ZORROZA CASTREJANA/,
            /\bZORROZA\b/,
            /^10$/,
            /^COPIA$/i,
            /Página \d+ de \d+/i,
            /^\d{10,}$/, // números largos como 2500822400
            /^[\d.,]+$/, // solo números con coma o punto
            /^\S{20,}$/,/// cadenas tipo TBAIA48446256180925wb5IXk6EjADpo183
            /^\d+[.,]?\d*\s*%$/,
            /^(\d{1,3}([.,]\d{3})*[.,]\d{2}|\d+[.,]\d{2})$///numéricos puros
        ];

        // Normaliza caracteres cirílicos visualmente similares
        texto = texto.replace(/Н/g, 'H').replace(/А/g, 'A');

        let lineas = texto.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
        lineas = lineas.filter(linea => {
            return !patronesExcluidos.some(patron => patron.test(linea.trim()));
        });
        const invoiceLines = [];
        const logs = [];

      const regex = /^([A-Z\d]+)\s+(.+?)\s+(-?\d+)\s+(-?[\d.,]+)(?:\s+(-?[\d.,]+)\s*%?)?\s+(-?\d+)\s+(-?[\d.,]+)$/i;


        for (let linea of lineas) {
            linea = linea.trim()
             .replace(/[^a-zA-Z0-9 .,&%\n\-\/]/g, '')  // Limpia caracteres no deseados
             ;  
            let match = linea.trim().match(regex);
            if (match) {
                const [_, codigo, articulo, cantidad, precio, descuento, iva, importe] = match;
                const producto = new FacturaLinea({
                    Referencia: codigo.trim().replace(/a/gi, "4"),
                    Articulo: articulo.trim().replace("NNN",""),
                    Cantidad: parseInt(cantidad),
                    PrecioCoste: precio.replace(/,/g, '.').includes(".") ? parseFloat(precio.replace(/,/g, '.')) : parseFloat(precio.replace(/,/g, '.'))/100,
                    Descuento: descuento ? parseFloat(descuento) : 0,
                    IVA: parseInt(iva)
                });
                // if(producto.Importe==parseFloat(importe)){
                    invoiceLines.push(producto);
                // }else{
                //     logs.push({ Error: "precio unitario, cantidad e importe no coherentes", Line: linea });
                // }
            }else{
                logs.push({ Error: "Formato no reconocido", Line: linea });
                console.debug("ERR(No match): " + linea);
            }
        }

        // Puedes usar logs para mostrar errores si lo deseas
        // document.getElementById("logFactura").innerHTML = logs.toTable();

        return invoiceLines;
    }
}
