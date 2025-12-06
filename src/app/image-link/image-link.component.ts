import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-image-link',
  templateUrl: './image-link.component.html',
  styleUrls: ['./image-link.component.scss']
})
export class ImageLinkComponent {
  @Input() src: string = '';
  @Input() height: number = 250;
}
