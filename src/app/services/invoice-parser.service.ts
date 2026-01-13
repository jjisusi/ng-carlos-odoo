import { Injectable } from '@angular/core';
import { FacturaLinea } from '../models/InvoiceLine';
import { Factura } from '../models/Invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceParserService {

  constructor() { }

    public parse(texto:string) {
  
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
          const invoice = new Factura([]);
          const logs = [];
          for (let linea of lineas) {
              var invoiceLine = this.parseInvoiceLine(linea);
              if (invoiceLine) {
                  invoice.lineas.push(invoiceLine);
              }else{
                  logs.push({ Error: "Formato no reconocido", Line: linea });
                  console.debug("ERR(No match): " + linea);
              }
          }
          return invoice;
      }


      parseInvoiceLine(linea:string):FacturaLinea|undefined{
        const regex = /^([A-Z\d]+)\s+(.+?)\s+(-?\d+)\s+(-?[\d.,]+)(?:\s+(-?[\d.,]+)\s*%?)?\s+(-?\d+)\s+(-?[\d.,]+)$/i;
        linea = linea.trim()
               .replace(/[^a-zA-Z0-9 .,&%\n\-\/]/g, '')  // Limpia caracteres no deseados
               ;  
        let match = linea.trim().match(regex);
        if (match) {
            const [_, codigo, articulo, cantidad, precio, descuento, iva, importe] = match;
            const producto = new FacturaLinea({
                Referencia: codigo.trim().replace(/a/gi, "4"),
                Articulo: articulo.trim().replace("NNN","").replace("TTT ",""),
                Cantidad: parseInt(cantidad),
                PrecioCoste: precio.replace(/,/g, '.').includes(".") ? parseFloat(precio.replace(/,/g, '.')) : parseFloat(precio.replace(/,/g, '.'))/100,
                Descuento: descuento ? parseFloat(descuento) : 0,
                IVA: parseInt(iva)
            });
            return producto;
        }
        return undefined;
      }
}
