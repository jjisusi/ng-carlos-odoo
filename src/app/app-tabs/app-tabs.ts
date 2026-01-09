import { Component, ViewChild } from '@angular/core';
import { CatalogoComponent } from '../components/catalogo/catalogo.component';
import { FacturaComponent } from '../components/factura/factura.component';
import { ConsolidationComponent } from '../components/consolidation/consolidation';
import { NovedadesComponent } from '../components/novedades/novedades.component';
import { UpdaterComponent } from '../components/updater/updater.component';
import { Toast } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Producto } from '../models/Producto';
import { Update } from '../models/Update';
import { Factura } from '../models/Invoice';
import { Catalogo } from '../models/catalogo';
import { MessageService } from 'primeng/api';
import { OdooExportService } from '../services/odoo-export.service';

@Component({
  selector: 'app-tabs',
  imports: [
    CatalogoComponent, 
    FacturaComponent, 
    ConsolidationComponent, 
    NovedadesComponent, 
    UpdaterComponent, 
    Toast, 
    TabsModule, 
    ProgressSpinnerModule
  ],
  templateUrl: './app-tabs.component.html',
  styleUrl: './app-tabs.scss',
})
export class AppTabs {
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
    this.currentTab = this.currentTab + 1;

  }
  onInvoiceParsed(factura: Factura): void {
    this.factura = factura;
    if (this.factura.lineas.length) {
      this.messageService.add({
        severity: 'success',
        detail: "La factura ha sido procesada correctamente, puedes continuar al siguiente paso"
      });
      this.updater.invoice=factura;
      this.updater.generateUpdates();
    }
  }
  onUpdaterTabChange(){
    this.onInvoiceParsed(this.factura);
  }
  onUpdated(updates: Update[]) {
    this.updates = updates.filter(x=>x.Active);
  }
  onConsolidatedTabChange(){
    this.onUpdated(this.updates);
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
