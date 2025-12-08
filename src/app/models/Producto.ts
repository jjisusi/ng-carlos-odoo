export class Producto {
    id: string;
    Referencia: string;
    Descripcion: string="";
    PrecioCoste: number;
    PrecioVenta: number;
    IVA: number;
    Imagen: string = "";
    constructor(json: any) {
        this.id = json.id;
        this.Referencia = json.default_code;
        this.Descripcion = json.name;
        this.PrecioCoste = parseFloat(json.standard_price);
        this.PrecioVenta = parseFloat(json.list_price);
        this.IVA = json["supplier_taxes_id/name"] || json["taxes_id/name"];
        if (json["supplier_taxes_id/name"] != json["taxes_id/name"]) {
            console.warn("El IVA de compras y ventas no conincide en " + this.Descripcion);
        }
    }
    get TipoImpuestoVenta() {
        return this.IVA == 10 ? 58 : 1;
    }
    get TipoImpuestoCompra() {
        return this.IVA == 10 ? 170 : 171;
    }
    get Margen(){
        return (this.PrecioVenta/this.PrecioCoste-1)*100;
    }
}
