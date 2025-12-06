import { Producto } from "./Producto";

export class Catalogo {
    productos:Producto[] = [];
    get Productos() {
        return this.productos;
    }
    get Size(){
        return this.productos.length;
    }
    constructor(array:any[]) {
        for (const p of array) {
            const producto = new Producto(p);
            this.productos.push(producto);
        }
    }
    clear(){
        this.productos=[];
    }
}

