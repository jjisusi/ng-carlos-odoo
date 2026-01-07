import { Component, Input, input, output, Output } from '@angular/core';
import { Update } from '../../models/Update';
import { CommonModule } from '@angular/common';
import { Factura } from '../../models/Invoice';
import { Catalogo } from '../../models/catalogo';
import { Producto } from '../../models/Producto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-updater',
  imports: [CommonModule,FormsModule],
  templateUrl: './updater.component.html',
  styleUrl: './updater.component.scss'
})
export class UpdaterComponent {
  @Input() invoice! : Factura;
  @Input() catalog!:Catalogo;
  @Input() updates: Update[] = [];

  update= output<Update[]>();

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
  generateUpdates() {
    this.updates = [];
    for (const art of this.invoice.lineas) {

      const found: Producto | undefined = this.catalog.productos.find(x => x.Referencia == art.Referencia);

      //to-do : update catalog
      if (!found) {
        const nuevo = new Producto({});
        nuevo.Referencia = art.Referencia,
          nuevo.Descripcion = art.Articulo.replace("NNN ", ""),
          nuevo.PrecioCoste = art.Precio,
          nuevo.Margen = 20,
          nuevo.IVA = art.IVA

        this.updates.push(new Update(nuevo, found));
      }
    }
    for (const art of this.invoice.lineas) {
      const found = this.catalog.productos.find(x => x.Referencia == art.Referencia);

      //to-do : update catalog
      if (found) {
        let hasChanged = false;
        const updated = new Producto({});
        updated.id = found.id;
        updated.Descripcion = found.Descripcion.replace("NNN ", "");
        updated.Referencia = found.Referencia;
        updated.PrecioCoste = found.PrecioCoste;
        updated.IVA = found.IVA;
        updated.Margen = found.Margen;
        if (found.Descripcion.normalize("NFKD").replace(/[^\x00-\x7F]/g, "") != art.Articulo.normalize("NFKD").replace(/[^\x00-\x7F]/g, "")) {
          updated.Descripcion = art.Articulo.replace("NNN ", "");
          hasChanged = true;
        }
        if (found.PrecioCoste != art.Precio && art.Precio != 0) {
          updated.PrecioCoste = art.Precio;
          updated.Margen=20;
          hasChanged = true;
        }
        if (found.IVA != art.IVA) {
          updated.IVA = art.IVA;
          hasChanged = true;
        }
        if (hasChanged)
          this.updates.push(new Update(updated, found));
      }
    }
    this.update.emit(this.updates);
  }
}
