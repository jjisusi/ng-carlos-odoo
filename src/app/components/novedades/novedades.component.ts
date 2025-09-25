import { Component, output } from '@angular/core';
import { Producto } from '../../models/Producto';

@Component({
  selector: 'app-novedades',
  standalone: true,
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss']
})
export class NovedadesComponent {
  images: any[] = [];
  uploaded = output<any>();
uploadImages(event: any) {

  const input = event.target as HTMLInputElement;
  const files = input.files;
  const promises: Promise<any>[] = [];

  for (const file of files || []) {
    const ref = parseInt(file.name.split(".")[0].replace("IMG-20250924-WA", ""), 10).toString();

    const promise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const producto = new Producto({});
        producto.id="";
        producto.Descripcion="NNN";
        producto.Referencia=ref;
        producto.Imagen = base64String.split(";")[1].replace("base64,", "");
        resolve(producto);
      };
      reader.readAsDataURL(file);
    });

    promises.push(promise);
  }

  Promise.all(promises).then((results) => {
    this.images = results;
    console.log("✅ Todas las imágenes han sido procesadas.");
    this.uploaded.emit(this.images);
    // Aquí puedes emitir un evento, mostrar un toast, etc.
  });
}
}
