export class Producto {
    id!: string;
    Referencia!: string;
    Descripcion: string = "";
    PrecioCoste!: number;
    PrecioVenta!: number;
    IVA!: number;
    Imagen: string = "";
    constructor(json: any) {
        if (json) {
            this.id = json.id;
            this.Referencia = json.default_code;
            this.Descripcion = json.name;
            this.PrecioCoste = parseFloat(json.standard_price);
            this.PrecioVenta = parseFloat(json.list_price);
            if(json["supplier_taxes_id"]){
                var taxes = (json["supplier_taxes_id"][0] || json["taxes_id"][0]);
                if (taxes) {
                    if (taxes == 58 || taxes == 170) {
                        this.IVA = 10
                    } else if (taxes == 1 || taxes == 171) {
                        this.IVA = 21
                    } else {
                        this.IVA = 0;
                        console.warn(`El artículo ${this.Descripcion} tiene IVA cero!!`)
                    }
                }
            }

        }
    }
    get TipoImpuestoVenta() {
        return this.IVA == 10 ? 58 : 1;
    }
    get TipoImpuestoCompra() {
        return this.IVA == 10 ? 170 : 171;
    }
    get Margen() {
        return (this.PrecioVenta / this.PrecioCoste - 1) * 100;
    }
}
