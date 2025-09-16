export class Invoice {
  lines: any[];
  constructor(lines: any[]) {
    this.lines = lines;
  }
  get Total() {
    return this.lines.sum(x => x.Importe * x.IVA / 100);
  }
  get Desglose() {
    const iva10 = this.lines.filter(x => x.IVA == 10);
    const iva21 = this.lines.filter(x => x.IVA == 21);
    return [
      {
        IVA: 10,
        Importe: iva10.sum(x => x.Importe),
        Cuota: iva10.sum(x => x.Cuota)
      },
      {
        IVA: 21,
        Importe: iva21.sum(x => x.Importe),
        Cuota: iva21.sum(x => x.Cuota)
      },
    ];
  }
}
