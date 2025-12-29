import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';
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
  async analyzeInvoice(file: File): Promise<string[]> {
    const pdfData = await file.arrayBuffer();
    const pdf = await (pdfjsLib as any).getDocument({ data: pdfData }).promise;
    const worker = await createWorker('spa');

    const results: string[] = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
      const image = canvas.toDataURL();

      const { data } = await worker.recognize(image);
      results.push(data.text);
    }

    await worker.terminate();
    return results;
  }

  uploadInvoice(file: File) { 
    const formData = new FormData(); 
    formData.append("file", file); 
    return this.http.post(this.apiUrl + "/invoice", formData); }
}
