import { Component, output } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Catalogo } from '../../models/catalogo';
import { TableModule} from 'primeng/table';
import { IconFieldModule} from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { CurrencyPipe } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';
import { OdooExportService } from '../../services/odoo-export.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss',
  imports:[TableModule, IconFieldModule,InputTextModule, InputIconModule,ProgressSpinner]
})
export class CatalogoComponent {
  loading =false;
  public catalogo: Catalogo = new Catalogo([]);
  uploaded = output<Catalogo>();
  constructor(
    private papa: Papa,
    private messages:MessageService,
    private odoo:OdooExportService
  ) {
    this.callService();
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
  callService(){
    this.loading =true;
    this.odoo.getProducts()
    .pipe(
      finalize (()=>this.loading=false)
    )
     .subscribe({ 
        next: (resp) => { 
          console.log('Catálogo recibido:', resp); 
          this.catalogo = new Catalogo(resp.products);
          this.uploaded.emit(this.catalogo);
        }, error: (err) => { 
          console.error('Error al obtener productos:', err); 
           this.messages.add({ 
            severity: 'error', 
            detail: "Error al obtener productos. Consulte al servicio técnico de IsusiSoft" 
          });
        }
      });
  }
}
