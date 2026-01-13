import { Component, Input, output } from '@angular/core';
import { CsvService } from '../../services/csv-service';
import { Update } from '../../models/Update';
import { OdooExportService as OdooService } from '../../services/odoo-export.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consolidation',
  templateUrl: './consolidation.html',
  styleUrl: './consolidation.scss',
  imports:[ProgressSpinnerModule,CommonModule]
})
export class ConsolidationComponent {
    loading=false;
    @Input() updates: Update[] = [];
    consolidated = output();
    constructor(
      private odooService:OdooService,
      private messageService:MessageService
    ){

    }
  consolidateUpdates() {
    this.loading = true;
    this.odooService.updateProduct(this.updates.filter(x=>x.Active).map(x => x.New))
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: resp => {
          this.messageService.add({
            severity: 'success',
            detail: "Los cambios se han subido correctamente a Odoo"
          });
          this.consolidated.emit();
        },
        error: err => this.messageService.add({
          severity: 'error',
          detail: "Ha ocurrido un error al subir los cambios a Odoo, consulte al técnico"
        })
      });
  }
}
