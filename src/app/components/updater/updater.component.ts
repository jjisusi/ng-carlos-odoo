import { Component, Input, input } from '@angular/core';
import { Update } from '../../models/Update';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-updater',
  imports: [CommonModule],
  templateUrl: './updater.component.html',
  styleUrl: './updater.component.scss'
})
export class UpdaterComponent {
  @Input() updates: Update[] = [];

  isAllChecked() {
    return !this.updates.some(x => !x.Active);
  }
  checkAll() {
    const checked: boolean = !this.updates.some(x => !x.Active);
    this.updates.forEach(x => x.Active = !checked);
  }
  onSelectUpdate(producto: Update) {
    producto.Active = !producto.Active;
  }
  onChangeProduct(evt: any, producto: Update) {
    const value = evt.target.value;
    const productToUpdate = this.updates.find(x => x.Old?.Referencia == producto.Old?.Referencia);
    if (productToUpdate) {
      productToUpdate.New.PrecioCoste = value;
    }
  }


  arrayToTabulatedText(): string {

    const data = this.updates.map(x => ({
      Ref: x.New.Referencia,
      Descripcion: x.New.Descripcion,
      Coste: x.New.PrecioCoste,
      Venta: x.New.PrecioVenta.toFixed(2),
      IVA: x.New.IVA,
      Margen:x.New.Margen,
      CosteAnt:x.Old?.PrecioCoste,
      VentaAnt:x.Old?.PrecioVenta.toFixed(2),
      IVAAnt:x.Old?.IVA,
      MargenAnt:x.Old?.Margen.toFixed(2)
    }));

    return this.arrayToAlignedText(data);
  }

  arrayToAlignedText(data: Record<string, any>[]): string {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);

    // Calcular el ancho máximo por columna
    const columnWidths = headers.map(header =>
      Math.max(header.length, ...data.map(row => String(row[header] ?? "").length))
    );

    // Formatear una fila
    const formatRow = (row: Record<string, any>) =>
      headers.map((header, i) => String(row[header] ?? "").padEnd(columnWidths[i])).join("  ");

    // Construir la tabla
    const headerLine = headers.map((h, i) => h.padEnd(columnWidths[i])).join("  ").trim();
    const rows = data.map(formatRow);

    return [headerLine, ...rows].join("\n");
  }


}
