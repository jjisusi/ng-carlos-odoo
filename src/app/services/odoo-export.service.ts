import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OdooExportService {

  private apiUrl = 'https://carlos65-server.onrender.com/odoo/get-products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    // Pedimos el resultado como Blob para poder descargar el CSV
    return this.http.get(this.apiUrl);
  }
}
