export class InvoiceLine {
  Referencia: any;
  Articulo: any;
  Cantidad: any;
  Precio: any;
  IVA: any;
  Descuento: any;
  constructor(json: any) {
    this.Referencia = json.Referencia;
    this.Articulo = json.Articulo;
    this.Cantidad = json.Cantidad;
    this.Precio = json.Precio;
    this.IVA = json.IVA;
    this.Descuento = json.Descuento || 0;
  }
  get Importe() {
    return this.Cantidad * this.Precio * (1 - this.Descuento / 100);
  }
  get Cuota() {
    return this.Cantidad * this.Precio * this.IVA / 100;
  }
  get Total() {
    return this.Importe + this.Cuota;
  }
  get TipoImpuesto() {
    return this.IVA == 10 ? 58 : 1;
  }
}
