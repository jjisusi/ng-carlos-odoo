import { Component, output } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Factura } from '../../models/Invoice';
import { FacturaLinea } from '../../models/InvoiceLine';
import { OcrService } from '../../services/ocr.service';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-factura',
  imports: [TableModule, ProgressSpinnerModule, CommonModule],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.scss'
})
export class FacturaComponent {
  loading = false;
  factura: Factura = new Factura([]);
  parsed = output<Factura>();
  constructor(
    private messages: MessageService,
    private ocrService: OcrService
  ) {
  }

  async uploadInvoicePdf(event: Event) {

    const input = event.target as HTMLInputElement;
    const txtInvoice = document.getElementById("txtInvoice") as HTMLInputElement;
    if (!input.files) return;
    this.loading = true;
    this.ocrService.uploadInvoice(input.files[0])
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data) => {
          txtInvoice.value = data.text;
          this.uploadInvoiceFromText();

        },
        error: () => {
          this.messages.add({
            severity: 'error',
            detail: "Error al subir factura productos. Consulte al servicio técnico de IsusiSoft"
          });
        }
      })
  }


  onPaste(event: ClipboardEvent) {
    const txtInvoice = document.getElementById("txtInvoice") as HTMLInputElement;
    const pastedText = event.clipboardData?.getData('text') || '';
    txtInvoice.textContent = pastedText;
    this.uploadInvoiceFromText();
  }
  separarLineasFactura(texto: string): string {
    return texto
      .replace(/\s+/g, " ") // todo a una sola línea, espacios simples
      .trim()
      // cortar antes de códigos de 1-5 dígitos seguidos de espacios y una letra mayúscula (inicio de producto)
      .split(/ (?=\d{1,5}\s+[A-ZÁÉÍÓÚÑ])/g)
      .map(l => l.trim())
      // nos quedamos solo con lo que realmente parece una línea de producto
      .filter(l => /^\d{1,5}\s+[A-ZÁÉÍÓÚÑ]/.test(l))
      .join("\n");
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
    this.parsed.emit(this.factura);
  }
  extraerProductos(texto: string) {

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

    const regex = /^(\d{1,5})\s+(.+?)\s+(\d+)\s+([\d.,]+)\s+(?:([\d.,]+)\s*%\s+)?([\d.,]+)\s+(\d{1,2})$/;


    for (let linea of lineas) {
      linea = linea.trim()
        .replace(/[^a-zA-Z0-9 .,&%\n\-\/]/g, '')  // Limpia caracteres no deseados
        ;
      let match = linea.trim().match(regex);
      if (match) {
        const [_, codigo, articulo, cantidad, precio, descuento, importe, iva] = match;
        const producto = new FacturaLinea({
          Referencia: codigo.trim().replace(/a/gi, "4"),
          Articulo: articulo.trim().replace("NNN", ""),
          Cantidad: parseInt(cantidad),
          PrecioCoste: precio.replace(/,/g, '.').includes(".") ? parseFloat(precio.replace(/,/g, '.')) : parseFloat(precio.replace(/,/g, '.')) / 100,
          Descuento: descuento ? parseFloat(descuento) : 0,
          IVA: parseInt(iva)
        });
        // if(producto.Importe==parseFloat(importe)){
        invoiceLines.push(producto);
        // }else{
        //     logs.push({ Error: "precio unitario, cantidad e importe no coherentes", Line: linea });
        // }
      } else {
        logs.push({ Error: "Formato no reconocido", Line: linea });
        console.debug("ERR(No match): " + linea);
      }
    }

    // Puedes usar logs para mostrar errores si lo deseas
    // document.getElementById("logFactura").innerHTML = logs.toTable();

    return invoiceLines;
  }
}
