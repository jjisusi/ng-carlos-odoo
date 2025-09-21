export class Producto {
    id: string;
    Referencia: string;
    Descripcion: string;
    PrecioCoste: number;
    PrecioVenta: number;
    IVA: number;
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
}
