import { Component, output } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Catalogo } from '../../models/catalogo';
import { TableModule} from 'primeng/table';
import { IconFieldModule} from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss',
  imports:[TableModule, IconFieldModule,InputTextModule, InputIconModule]
})
export class CatalogoComponent {
  public catalogo: Catalogo = new Catalogo([]);
  uploaded = output<Catalogo>();
  constructor(
    private papa: Papa,
    private messages:MessageService
  ) {
  }
  public upload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const lastModified = file.lastModified;
    const now = Date.now();

    const diffHours = (now - lastModified) / (1000 * 60 * 60);

    if (diffHours > 24) {
      this.messages.add({ 
        severity: 'warn', 
        detail: "⚠️ El archivo fue modificado hace más de 24 horas" 
      });
    }
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
