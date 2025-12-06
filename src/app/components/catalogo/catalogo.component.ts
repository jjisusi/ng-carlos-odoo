import { Component, output } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Catalogo } from '../../models/catalogo';
import { ImageLinkComponent } from "../../image-link/image-link.component";

@Component({
  selector: 'app-catalogo',
  imports: [ImageLinkComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})
export class CatalogoComponent {
  public catalogo: Catalogo = new Catalogo([]);
  uploaded = output<Catalogo>();
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
        this.uploaded.emit(this.catalogo);
      },
      error: (err) => {
        console.error('Error al procesar el CSV:', err.message);
      }
    });
  }
}
