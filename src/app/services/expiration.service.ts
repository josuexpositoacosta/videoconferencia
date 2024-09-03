import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ExpirationService {

  constructor(@Inject(PLATFORM_ID) private platformId: string,
              private router: Router
) { }

  checkExpiration(): boolean {
    try {
      if (this.platformId === 'browser') {
        const installationDate = localStorage.getItem('installationDate');
        if (!installationDate) {
          localStorage.setItem('installationDate', new Date().toISOString());
          return false;
        }

        const expirationDate = new Date(installationDate);
        expirationDate.setDate(expirationDate.getDate() + 7); // agregar 7 días

        const currentDate = new Date();
        if (currentDate > expirationDate) {
          throw new Error('La aplicación ha expirado');
        }

        return false;
      } else {
        // No se puede acceder a localStorage en el servidor
        return false;
      }
    } catch (error) {
      this.showExpirationMessage();
      return true;
    }
  }

  showExpirationMessage(): void {
    if (this.platformId === 'browser') {
      Swal.fire({
        title: 'La aplicación ha expirado',
        text: 'Por favor, actualice la aplicación para continuar utilizando nuestros servicios.',
       // icon: 'warning',
        //icon: 'success',
        //icon: 'error',
        icon: 'info',
        //icon: 'question',
        showConfirmButton: false,        
        showCancelButton: false,
      // closeOnConfirm: false,
    //   closeOnCancel: false,
       allowOutsideClick: false,
        //timer: 2000
      }).finally(() => {
        this.router.navigate(['/expired']);
      });
    }
  }
}