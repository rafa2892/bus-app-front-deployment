import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalUtilsService {

  constructor() { }

  getNumeroUnidadFormateado(numeroUnidad: number): string {
    if(numeroUnidad)
      return `UN-${numeroUnidad.toString().padStart(3, '0')}`;
    else
      return '';
  }

   // Método para activar el parpadeo de los campos faltantes
   activarParpadeo(campos: string[]) {
    campos.forEach((campoId) => {
      
      const elemento = document.getElementById(campoId);
      
      if(campoId === 'fecha-nacimiento') {
        const elementoPicker =  document.getElementById('mat-picker-date-component');
        elementoPicker?.classList.add('input-error-date-picker');
        setTimeout(() => {
          elementoPicker?.classList.remove('input-error-date-picker');
        }, 1500)
      } 
      
      if (elemento) {
        elemento.classList.add('input-error-blink');
        // Remueve la clase después de 2 segundos
        setTimeout(() => {
          elemento.classList.remove('input-error-blink');
        }, 1500);
      }
    });
  }


}
