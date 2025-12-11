import { Component, Input, output } from '@angular/core';
import { CsvService } from '../../services/csv-service';
import { Update } from '../../models/Update';
import { ImageLinkComponent } from '../../image-link/image-link.component';

@Component({
  selector: 'app-consolidation',
  imports: [ImageLinkComponent],
  templateUrl: './consolidation.html',
  styleUrl: './consolidation.scss',
})
export class Consolidation {
    @Input() updates: Update[] = [];
    uploaded = output();
    constructor(
      private csvService:CsvService
    ){

    }
    download(){
        const csv = this.updates.filter(x=>x.Active).map(x=>x.New).toCSV(["id", "Referencia", "Descripcion", "PrecioCoste", "PrecioVenta", "TipoImpuestoVenta","TipoImpuestoCompra"]);
        this.csvService.download(csv, "toImport.csv");
    }
}
