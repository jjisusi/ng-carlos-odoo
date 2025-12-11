import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
      public download(csvContent:string, nombreArchivo:String) {
        // 2. Crea un Blob y una URL
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // 3. Crea y simula un clic en el enlace de descarga
        const enlace = document.createElement('a');
        enlace.setAttribute('href', url);
        enlace.setAttribute('download', nombreArchivo + '.csv'); // 4. Asigna el nombre del archivo

        enlace.style.display = 'none'; // Oculta el enlace
        document.body.appendChild(enlace);

        enlace.click(); // 5. Simula el clic

        document.body.removeChild(enlace); // 6. Elimina el enlace
        URL.revokeObjectURL(url); // Libera la URL del objeto
    }
}
