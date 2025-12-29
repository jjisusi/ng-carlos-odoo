import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  apiUrl: string= environment.apiUrl + "/ocr";
  constructor(
    private http:HttpClient
  ){

  }
  uploadInvoice(file: File) { 
    const formData = new FormData(); 
    formData.append("file", file); 
    return this.http.post(this.apiUrl + "/invoice", formData); }
}
