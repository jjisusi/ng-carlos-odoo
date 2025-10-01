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
    return this.lineas.sum(x => x.Importe * (1 + x.IVA / 100));
  }
  public get Desglose():Desglose[] {
        const iva10 = this.lineas.filter(x => x.IVA == 10);
        const iva21 = this.lineas.filter(x => x.IVA == 21);
        return [
            {
                IVA: "10",
                Importe: iva10.sum(x => x.Importe),
                Cuota: iva10.sum(x => x.Cuota),
                Total:null
            },
            {
                IVA: "21",
                Importe: iva21.sum(x => x.Importe),
                Cuota: iva21.sum(x => x.Cuota),
                Total:null
            }
        ];
  }
}

interface Desglose{
  IVA:string;
  Importe:number;
  Cuota:number;
  Total:number|null;
}