import { Component } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Catalogo } from '../models/catalogo';

@Component({
  selector: 'app-catalogo',
  imports: [],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})
export class CatalogoComponent {
  public catalogo: Catalogo = new Catalogo([]);

  constructor(private papa: Papa) {
  }
  public upload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        this.catalogo = new Catalogo(results.data);
        // const catalogoElement = document.getElementById("catalogo");
        // if (catalogoElement) {
        //   catalogoElement.innerHTML = this.catalogo.toTable();
        // }
      },
      error: (err) => {
        console.error('Error al procesar el CSV:', err.message);
      }
    });
  }
}
