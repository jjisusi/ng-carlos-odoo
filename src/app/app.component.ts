import { Component, ViewChild } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Factura } from './models/Invoice';
import { Catalogo } from './models/catalogo';
import { Producto } from './models/Producto';
import { Update } from './models/Update';
import { NovedadesComponent } from "./components/novedades/novedades.component";
import { FacturaComponent } from './components/factura/factura.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { UpdaterComponent } from './components/updater/updater.component';
import { Toast } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { MessageService } from 'primeng/api';
import { OdooExportService } from './services/odoo-export.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs';
import { ConsolidationComponent } from './components/consolidation/consolidation';

@Component({
  selector: 'app-root',
  imports: [CatalogoComponent, FacturaComponent, ConsolidationComponent, NovedadesComponent, UpdaterComponent, Toast, TabsModule, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {
  loading = false;
  title = 'ng-carlos-odoo';
  currentTab: number = 0;
  catalogo: Catalogo = new Catalogo([]);
  factura: Factura = new Factura([]);
  updates: Update[] = [];
  inserts: Producto[] = [];
  novedades: Producto[] = [];

  @ViewChild('catalogComponent') catalogComponent!: CatalogoComponent;
  @ViewChild('updater') updater!: UpdaterComponent;
  @ViewChild('invoiceRecognizer') invoiceRecognizer!: FacturaComponent;

  constructor(
    private messageService: MessageService,
    private odooService: OdooExportService
  ) {
  }
  onCatalogUploaded(catalogo: Catalogo): void {
    this.catalogo = catalogo;
    this.messageService.add({
      severity: 'success',
      detail: "El catálogo ha sido importado correctamente, puedes continuar al siguiente paso"
    });
    setTimeout(() => {
      this.currentTab = this.currentTab + 1;
    }, 2000); // 5000 milisegundos = 5 segundos

  }
  onInvoiceParsed(factura: Factura): void {
    this.factura = factura;
    if (this.factura.lineas.length) {
      this.messageService.add({
        severity: 'success',
        detail: "La factura ha sido procesada correctamente, puedes continuar al siguiente paso"
      });
      this.updater.generateUpdates();
    }
  }
  onUpdaterTabChange(){
    debugger;
    this.onInvoiceParsed(this.factura);
  }
  onUpdated(updates: Update[]) {
    this.updates = updates;
  }
  onConsolidated() {
    this.updates = [];
    this.catalogComponent.callService();
    // this.onInvoiceParsed(this.factura);
  }
  procesarNovedades(items: Producto[]) {
    this.novedades = [];
    for (const novedad of items) {
      if (this.catalogo.Productos.find(x => x.Referencia == novedad.Referencia)) {

      } else {
        this.novedades.push(novedad);
      }
    }
  }
}

