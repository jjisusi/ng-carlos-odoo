import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/Producto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OdooExportService {

 private apiUrl = environment.apiUrl + "/odoo";
  constructor(private http: HttpClient) {

  }

  getProducts(): Observable<any> {
    // Pedimos el resultado como Blob para poder descargar el CSV
    return this.http.get(this.apiUrl + "/get-products");
  }
  updateProduct(products:Producto[]):Observable<any>{
    var mapped = products.map(product=>(
        { 
          default_code: product.Referencia, 
          name: product.Descripcion, 
          list_price: product.PrecioVenta, 
          standard_price: product.PrecioCoste, 
          taxes_id: product.TipoImpuestoVenta, 
          supplier_taxes_id: product.TipoImpuestoCompra
        })
      );
    return this.http.post(this.apiUrl + "/update-products", { products: mapped });
  }
  
}
