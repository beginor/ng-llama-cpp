import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { FormatterService } from './services/formatter.service';
import { NavService } from './services/nav.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withHashLocation()),
        provideHttpClient(withFetch()),
        FormsModule,
        FormatterService,
        NavService,
    ]
};
