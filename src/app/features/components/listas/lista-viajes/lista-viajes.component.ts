import { Component } from '@angular/core'
import {Viaje} from "../../../../core/models/viaje";
import {ViajeServicioService} from "../../../../core/services/viaje-servicio.service";
import { ActivatedRoute, Router } from '@angular/router';
import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TITLES } from '../../../../constant/titles.constants';

@Component({
  selector: 'app-lista-viajes',
  templateUrl: './lista-viajes.component.html',
  styleUrl: './lista-viajes.component.css'
})
export class ListaViajesComponent {

  viajes: Viaje[];
  p: number = 1;
  editIcon = fontAwesomeIcons.editIcon;
  deleteIcon = fontAwesomeIcons.deleteIcon;
  eyeIcon = fontAwesomeIcons.eyeIcon;


  //viaje Seleccionado Detalles
  viajeSelDetails : Viaje;

  constructor(
    private viajeServicio:ViajeServicioService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    const idConductorStr = this.activatedRoute.snapshot.paramMap.get('idConductor'); 
    
    //Convertimos el valor a número
    const idConductor = idConductorStr ? +idConductorStr : null;

    // Si se recibe un id de conductor, se filtran los viajes por ese conductor
    if(idConductor) {
      this.obtenerListaViajePorConductor(idConductor);
    } else {
      this.obtenerListaViaje();
    }
  }

  private obtenerListaViaje(): void {
    this.viajeServicio.obtenerListaViaje().subscribe({
      next: (dato) => {
        // Si el backend devuelve null, asignamos un array vacío
        this.viajes = dato || [];
      },
      error: (error) => {
        console.error('Error al obtener la lista de viajes:', error);
        this.viajes = []; // En caso de error, dejamos la lista vacía
        this.mostrarNotificacion('No se pudo cargar la lista de viajes.', 'error-snackbar');
      }
    });
  }

  private obtenerListaViajePorConductor(idConductor: number) {
    this.viajeServicio.obtenerListaViajePorConductor(idConductor).subscribe(dato =>  {
      this.viajes = dato;
    });
  }

  getNumeroUnidadFormateado(numeroUnidad: number): string {
    return `UN-${numeroUnidad.toString().padStart(3, '0')}`;
  }

  detallesViaje(viaje:Viaje) {
    this.viajeSelDetails = viaje;
  }

  //CRUD
  
  editar(viaje:Viaje) {
    this.router.navigate(['/registrar-viaje', viaje.id]);
  }

  async eliminar(id:number){
    const eliminarConfirmado = await this.eliminarViaje();
    if (eliminarConfirmado) {
      this.viajeServicio.eliminar(id).subscribe({
        next: () => {
          this.mostrarNotificacion('Viaje eliminado con éxito.', 'success-snackbar');
          this.obtenerListaViaje();
        },
        error: (error) => {
          console.error('Error al eliminar el viaje:', error); // Registro para depuración
          this.mostrarNotificacion('Ocurrió un error al eliminar el viaje. Por favor, inténtelo más tarde.', 'error-snackbar');
        }
      });
    }
  }

  // Método centralizado para mostrar notificaciones
  private mostrarNotificacion(mensaje: string, estilo: string): void {
    this._snackBar.open(mensaje, '', {
      duration: 3000, // Duración ajustable según necesidad
      panelClass: [estilo],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  async eliminarViaje(): Promise<boolean>{
    const result = await Swal.fire({
        title: 'Confirmar eliminar',
        text: 'Se va a eliminar permanentemente un servicio registrado (viaje), ¿Desea continuar con la eliminación?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Atras',
        confirmButtonText: 'Eliminar',
        reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return false; // Detenemos el flujo
    }else {
    return true;
    }
  }

}
