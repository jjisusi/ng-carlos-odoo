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

    isAllChecked(){
      return !this.updates.some(x=>!x.Active);
    }
    checkAll(){
      const checked:boolean = !this.updates.some(x=>!x.Active);
      this.updates.forEach(x=>x.Active=!checked);
    }
    onSelectUpdate(producto:Update){
      producto.Active=!producto.Active; 
    }
    onChangeProduct(evt:any, producto:Update){
      const value = evt.target.value;
      const productToUpdate = this.updates.find(x=>x.Old?.Referencia==producto.Old?.Referencia);
      if(productToUpdate){
        productToUpdate.New.PrecioCoste=value;
      }
    }
}
