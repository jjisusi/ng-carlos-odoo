// invoice-mindee.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class InvoiceMindeeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.mindee.net/v1/products/mindee/invoice/v1/predict';
  private apiKey = 'md_JsrZhneHCShsfuHV8Rp0EKhn1reSHLtt'; // Regístrate gratis en mindee.com

  analyzeInvoice(file: File) {
    const formData = new FormData();
    formData.append('document', file);

    const headers = new HttpHeaders({
      'Authorization': `Token ${this.apiKey}`
    });

    return this.http.post(this.apiUrl, formData, { headers });
  }
}
