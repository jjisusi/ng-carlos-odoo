import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OdooExportService {

  private apiUrl = 'https://carlos65.odoo.com/web/export/csv';

  constructor(private http: HttpClient) {}

  exportProducts(): Observable<Blob> {
    const payload = {
      token: 'dummy-because-api-expects-one',
      csrf_token: '6e54cfeb9917a284cda8699f701fa04a24a952a4o1796847934',
      context: {
        sale_multi_pricelist_product_template: 1,
        lang: 'es_ES',
        tz: 'Europe/Madrid',
        uid: 5,
        allowed_company_ids: [1]
      },
      domain: [['sale_ok', '=', true]],
      fields: [
        { name: 'id', label: 'ID externo' },
        { name: 'default_code', label: 'Referencia interna', type: 'char' },
        { name: 'name', label: 'Nombre', type: 'char' },
        { name: 'standard_price', label: 'Coste', type: 'float' },
        { name: 'list_price', label: 'Precio de venta', type: 'float' },
        { name: 'taxes_id/name', label: 'Impuesto de ventas/Nombre del impuesto', type: 'char' },
        { name: 'supplier_taxes_id/name', label: 'Impuestos de compra/Nombre del impuesto', type: 'char' }
      ],
      groupby: [],
      ids: false,
      model: 'product.template'
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Pedimos el resultado como Blob para poder descargar el CSV
    return this.http.post(this.apiUrl, payload, { headers, responseType: 'blob' });
  }
}
