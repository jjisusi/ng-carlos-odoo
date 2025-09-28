import { Component, Input, input } from '@angular/core';
import { Update } from '../../models/Update';

@Component({
  selector: 'app-updater',
  imports: [],
  templateUrl: './updater.component.html',
  styleUrl: './updater.component.scss'
})
export class UpdaterComponent {
  updates=input<Update[]>();
}
