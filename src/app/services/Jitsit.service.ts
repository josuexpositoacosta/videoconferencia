import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JitsiService {
  private jitsiLoaded = false;

  constructor() {}

 /* async loadJitsiScript(): Promise<void> {
    if (!this.jitsiLoaded && typeof window !== 'undefined') {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${environment.urlHost}/${environment.urlApi}`;
        script.async = true;
        script.onload = () => {
          this.jitsiLoaded = true;
          resolve();
        };
        script.onerror = () => reject(new Error('No se pudo cargar el script de Jitsi Meet'));
        document.body.appendChild(script);
      });
    }
  }*/

    async loadJitsiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${environment.urlHost}/${environment.urlApi}`; // Asegúrate de que esta URL apunte al script correcto de Jitsi Meet
      script.async = true;
      script.onload = () => {
        window.JitsiMeetJS = this.JitsiMeetJS; // Hacer JitsiMeetJS accesible globalmente
        resolve();
      };
      script.onerror = () => reject(new Error('No se pudo cargar el script de Jitsi Meet'));
      document.body.appendChild(script);
    });
  }
  
  get JitsiMeetJS(): any {
    if (typeof window !== 'undefined') {
      return window['JitsiMeetJS'];
    }
    return null;
  }
}
