import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpirationService } from './services/expiration.service';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { resolve } from 'dns';

declare var JitsiMeetExternalAPI: any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'VideoConferencia';
  @ViewChild('jitsiIframe', { static: true }) // Asegurarse de que el iframe esté listo en ngAfterViewInit
  jitsiIframe!: ElementRef;
  expired!: boolean;
  url!: string;
  jitsiApi!: any;

  selectedAudioInputDeviceId: string | null = null;
  selectedAudioOutputDeviceId: string | null = null;
  selectedVideoInputDeviceId: string | null = null;


  async selectDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
      const videoInputs = devices.filter(device => device.kind === 'videoinput');

      console.log('Audio Inputs:', audioInputs.map(input => input.label));
      console.log('Audio Outputs:', audioOutputs.map(output => output.label));
      console.log('Video Inputs:', videoInputs.map(input => input.label));

      // Aquí deberías implementar la lógica para permitir al usuario seleccionar dispositivos.
      // Por ejemplo, podrías mostrar un cuadro de diálogo o un modal con las opciones.
      // Una vez seleccionados, actualiza los campos correspondientes en tu componente.
    } catch (err) {
      console.error('Error al enumerar dispositivos:', err);
    }
  }


  onPlayerReady(event: any) {
    // Lógica para cuando el reproductor está listo
  }

  onPlayerStateChange(event: any) {
    // Lógica para cuando cambia el estado del reproductor
  }

  constructor(
   // private http: HttpClient,
    private expirationService: ExpirationService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit(): void {
    this.expired = this.expirationService.checkExpiration();
    if (this.expired) {
      this.expirationService.showExpirationMessage();
      return;
    }
  }

  

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Asegúrate de que la URL esté correctamente formada
      const apiUrl = `${environment.urlHost}/${environment.urlApi}`;
      //const apiUrl = `/${environment.urlApi}`; // Ruta que coincide con la configuración del proxy
      this.loadScript(apiUrl).then(() => {
        console.log('Script cargado correctamente');
        this.loadJitsiMeetConference();
      }).catch((error) => {
        console.error("Error al cargar el script de Jitsi Meet:", error);
        // Maneja el error adecuadamente, por ejemplo, mostrando un mensaje al usuario
      });
    }
  }

 /* loadScript(scriptUrl: any): Promise<any> {
    //const scriptUrl = 'https://vc.tecsi.hmn.scu.sld.cu/external_api.js';
    
    return new Promise((resolve, reject) => {
    this.http.get(scriptUrl, { responseType: 'text' })
      .subscribe(
        (scriptContent: string) => {
          // Maneja el contenido del script aquí
          const script = document.createElement('script');
          script.src = scriptUrl;
          script.crossOrigin = "anonymous"; // Intenta cargar el script de forma anónima
          script.onload = () => resolve(true); // Resuelve la promesa cuando el script se carga correctamente

          console.log('Script cargado correctamente:', scriptContent);
          document.body.appendChild(script);
          // Ejecuta el script
          eval(scriptContent);
        },
        (error: any) => {
          console.error('Error al cargar el script:', error);
          // Mostrar un mensaje de error al usuario
          console.error(`Error cargando el script ${scriptUrl}:`, error);
          reject(new Error(`Error cargando el script ${scriptUrl}`));
        }
      );
    });
  }*/

  loadScript(url: string): Promise<any> {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Accept-Language, Content-Language, Authorization'
    });

 //  if (environment.ignoreCertificateVerification) {
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
     // script.crossOrigin = "anonymous"; // Intenta cargar el script de forma anónima
      script.onload = () => resolve(true); // Resuelve la promesa cuando el script se carga correctamente

      script.onerror = (errorEvent) => {
       // JSON.stringify(errorEvent, ["message", "arguments", "type", "name"])
        console.error(`Error cargando el script ${url}:`, errorEvent);
        reject(new Error(`Error cargando el script ${url}`));
      };
     
      document.body.appendChild(script);
    });

   /*  } else {
      // Ignora la verificación del certificado
      console.error(`Error  certificado ${url}:`, ErrorEvent);
      return Promise.reject(new Error(`Ignoring certificate verification for ${url}`));
     
    }*/
  }




  loadJitsiMeetConference(): void {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Accept-Language, Content-Language, Authorization'
    });
   // this.url = 'vc.tecsi.hmn.scu.sld.cu';
    const domain = `${environment.url}`;
    const options = {
     // roomName: 'JitsiMeetAPIExample',
      width: 700,
      height: 700,

     /* devices: {
        audioInput: this.selectedAudioInputDeviceId || '',
        audioOutput: this.selectedAudioOutputDeviceId || '',
        videoInput: this.selectedVideoInputDeviceId || ''
      },*/
     // roomName: 'Video Conferencia',
    
   /*  videoId: 'M7lc1UVf-VE',
     playerVars: {
         'controls': 1,
         //'speaker-selection': 1 // Eliminar esta línea si no es válida
     },
     events: {
         'onReady': this.onPlayerReady,
         'onStateChange': this.onPlayerStateChange
     },*/
      parentNode: this.jitsiIframe.nativeElement, // Asegúrate de que este elemento esté listo
    //   lang: 'es'
      // ... otras opciones ...
 

   /*   iceServers: {
        replace: [
            { // replace the URL of all existing ice servers with type matching targetType 
             //   targetType: 'turn',
               // urls: 'turn:example.com:443'
            },
            { // replace the URL of all existing ice servers with type matching targetType 
             //   targetType: 'turns',
              //  urls: 'vc.tecsi.hmn.scu.sld.cu:443?transport=tcp'
            },
            { // remove all existing ice servers with type matching targetType 
           //     targetType: 'stun',
             //   urls: null
            }
        ]
      },
        userInfo: {
          email: 'jexpositoacosta@gmail.com',
          displayName: 'Josué Exposito Acosta'
       }
*/
    };

    console.log('Configurando Jitsi con las siguientes opciones:', options);

    this.jitsiApi = new JitsiMeetExternalAPI(domain, options);
    this.jitsiApi.addEventListener('videoConferenceJoined', () => {
      console.log('Local User Joined');
      // Initialize Jitsi Meet here
    });
  }

}
function reject(arg0: Error) {
  throw new Error('Function not implemented.');
}

