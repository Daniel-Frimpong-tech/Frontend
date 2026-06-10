/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

async function loadGoogleMaps(): Promise<void> {
  const key = environment.GOOGLE_MAPS_KEY;
  if (!key) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });
}

loadGoogleMaps()
  .then(() => bootstrapApplication(AppComponent, appConfig))
  .catch((err) => {
    console.error('Error during bootstrap or loading Google Maps:', err);
    bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
  });
