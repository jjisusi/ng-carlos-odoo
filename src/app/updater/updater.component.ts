import { Component, Input, input } from '@angular/core';
import { Producto } from '../models/Producto';

@Component({
  selector: 'app-updater',
  imports: [],
  templateUrl: './updater.component.html',
  styleUrl: './updater.component.scss'
})
export class UpdaterComponent {
  value=input<Producto[]>();
}
