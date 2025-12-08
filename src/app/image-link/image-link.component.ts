import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-image-link',
  templateUrl: './image-link.component.html',
  styleUrls: ['./image-link.component.scss'],
  imports:[CommonModule,Dialog, ButtonModule]
})
export class ImageLinkComponent {
  @Input() src: string = '';
  @Input() height: number = 250;

  showModal: boolean = false;

  openModal() {
    this.showModal = true;
    // añadimos backdrop manualmente
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    backdrop.id = 'custom-backdrop';
    document.body.appendChild(backdrop);
  }

  closeModal() {
    this.showModal = false;
    const backdrop = document.getElementById('custom-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
}
