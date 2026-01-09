import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';

import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
        { provide: LOCALE_ID, useValue: 'es-ES' },
        provideZoneChangeDetection({ eventCoalescing: true }), 
        provideRouter(routes),
        providePrimeNG({
                theme: {
                    preset: Aura
                }
            }),
        MessageService
    ]
};


