import { Producto } from "./Producto";

export class Update {
    Active:boolean=true;
    New!: Producto;
    Old: Producto|undefined;

    constructor(news:Producto,old:Producto|undefined){
        this.New=news;
        this.Old=old;
    }
}
