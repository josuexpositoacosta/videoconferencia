
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { environment } from '../environments/environment';
import { JitsiService } from './services/Jitsit.service';


//declare var JitsiMeetExternalAPI: any;
declare var JitsiMeetJS: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private jitsiService: JitsiService) {}

  title = 'VideoConferencia';

  private jitsi: any;
  private connection: any;
  private room: any;

  private options = {
    hosts: {
      domain: `${environment.urlHost}`,
      muc: `${environment.urlHost}`
    },
    bosh: `${environment.urlHost}/http-bind`
  };

  private confOptions = {
    openBridgeChannel: true
  };

  private initOptions = {
    disableAudioLevels: true,
    desktopSharingChromeExtId: 'mbocklcggfhnbahlnepmldehdhpjfcjp',
    desktopSharingChromeDisabled: false,
    desktopSharingChromeSources: ['screen', 'window'],
    desktopSharingChromeMinExtVersion: '0.1',
    desktopSharingFirefoxDisabled: true
  };

/*  ngOnInit() {
    if (typeof window !== 'undefined' && JitsiMeetJS) {
      this.jitsi = JitsiMeetJS;
      this.jitsi.init(this.initOptions);
      this.connection = this.createConnection(this.options);
      this.setConnectionListeners(this.connection);

      this.room = this.createRoom(this.connection, this.confOptions);
      this.setRoomListeners(this.room);
      this.room.join();
    } else {
      console.log('Jitsi Meet JS SDK no está disponible o no hay ventana disponible');
    }
  }*/
 /*ngOnInit() {
  this.jitsiService.loadJitsiScript().then(() => {
    if (this.jitsiService.JitsiMeetJS) {
    if (typeof window !== 'undefined' && JitsiMeetJS) {
      this.jitsi = JitsiMeetJS;
      this.jitsi.init(this.initOptions);
      this.connection = this.createConnection(this.options);
      this.setConnectionListeners(this.connection);

      this.room = this.createRoom(this.connection, this.confOptions);
      this.setRoomListeners(this.room);
      this.room.join();
      }
    } else {
      console.log('Jitsi Meet JS SDK no está disponible o no hay ventana disponible');
    }
  }).catch((error) => {
    console.error('Error al cargar el script de Jitsi Meet:', error);
  });
  
 }
*/

ngOnInit() {
  this.jitsiService.loadJitsiScript().then(() => {
    if (window.JitsiMeetJS) { // Usa window.JitsiMeetJS para acceder al SDK
      const options = {
        hosts: {
          domain: environment.urlHost,
          muc: environment.urlHost
        },
        bosh: `${environment.urlHost}${environment.urlApi}`
      };

      this.initializeJitsi(options);
    } else {
      console.log('Jitsi Meet JS SDK no está disponible o no hay ventana disponible');
    }
  }).catch((error) => {
    console.error('Error al cargar el script de Jitsi Meet:', error);
  });
}

initializeJitsi(options: { hosts: { domain: string; muc: string; }; bosh: string; }) {
  this.jitsi = JitsiMeetJS;
  this.jitsi.init(options);
  // Aquí puedes continuar con la creación de la conexión y la sala
      this.connection = this.createConnection(this.options);
      this.setConnectionListeners(this.connection);

      this.room = this.createRoom(this.connection, this.confOptions);
      this.setRoomListeners(this.room);
      this.room.join();

}

private loadJitsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js'; // URL del script de Jitsi Meet
    script.async = true;
    script.onload = () => resolve(); // Resuelve la promesa cuando el script se carga
    script.onerror = () => reject(new Error('No se pudo cargar el script de Jitsi Meet')); // Rechaza la promesa si hay un error al cargar el script
    document.body.appendChild(script);
  });
}


  private createConnection(options: { bosh?: any; hosts: object; useStunTurn?: boolean; enableLipSync?: boolean }): any {
    return new this.jitsi.JitsiConnection(null, null, options);
  }

  private setConnectionListeners(connection: any): void {
    connection.addEventListener(this.jitsi.events.connection.CONNECTION_ESTABLISHED, this.onConnectionSuccess);
    connection.addEventListener(this.jitsi.events.connection.CONNECTION_FAILED, this.onConnectionFailed);
    connection.addEventListener(this.jitsi.events.connection.CONNECTION_DISCONNECTED, this.disconnect);
  }

  private createRoom(connection: any, options: object): void {
    const room = connection.initJitsiConference('conference', options);
    return room;
  }

  private setRoomListeners(room: any): void {
    room.on(this.jitsi.events.conference.TRACK_ADDED, this.onRemoteTrack);
    room.on(this.jitsi.events.conference.CONFERENCE_JOINED, this.onConferenceJoined);
  }

  private onConnectionSuccess(data: any): void {
    console.log('Conexión exitosa', data);
  }

  private onConnectionFailed(data: any): void {
    console.log('Conexión fallida', data);
  }

  private disconnect(): void {
    console.log('Desconectando...');
  }

  private onRemoteTrack(data: any): void {
    console.log('Pista remota agregada', data);
  }

  private onConferenceJoined(data: any): void {
    console.log('Unido a la conferencia', data);
  }
}
