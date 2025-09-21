import { FacturaLinea } from "./InvoiceLine";

export class Factura {
  lineas: FacturaLinea[]=[];
  constructor(lines: any[]) {
    for(const item of lines){
      this.lineas.push(new FacturaLinea(item));
    }
    this.lineas = lines;
  }
  public get Total() {
    return this.lineas.sum(x => x.Importe * x.IVA / 100);
  }
  public get Desglose() {
        const iva10 = this.lineas.filter(x => x.IVA == 10);
        const iva21 = this.lineas.filter(x => x.IVA == 21);
        return [
            {
                IVA: "10",
                Importe: iva10.sum(x => x.Importe),
                Cuota: iva10.sum(x => x.Cuota),
                Total:""
            },
            {
                IVA: "21",
                Importe: iva21.sum(x => x.Importe),
                Cuota: iva21.sum(x => x.Cuota),
                Total:""
            },            
            {
                IVA: "",
                Importe: this.lineas.sum(x=>x.Importe),
                Cuota: this.lineas.sum(x => x.Cuota),
                Total: this.lineas.sum(x=>x.Total)
            },
        ];
  }
}
