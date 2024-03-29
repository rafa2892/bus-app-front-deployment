import { Component, OnInit } from '@angular/core';
import { Carro } from '../carro';
import { CarroService } from '../carro.service';
import { Router } from '@angular/router';
import { faCar, faPlus, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Imagen } from '../imagen';


@Component({
  selector: 'app-registrar-carro',
  templateUrl: './registrar-carro.component.html',
  styleUrl: './registrar-carro.component.css'
})
export class RegistrarCarroComponent  implements OnInit{

carro : Carro =  new Carro();
carroLista : Carro [] ;
carIcon = faCar;
plusIcon = faPlusCircle;
mensaje : string = '';
anyoActual = new Date().getFullYear();

//variables validaciones input
generalErrorFlag = false;
noModeloError = false;
noMarcaError = false;
noAnyoError = false;
noNumeroUnidad = false;
nonNumericError = false;
nonNumericConsumo = false;
nonNumericNumUnidad = false;
unidadRepetida =  false;

selectedFiles: File[] = [];
imagenes: string [];
imagenesBase64 : string [];
imagenGuardar : Imagen [] = [];

 prueba1 :string []  = [];


//Mensajes Error
mensajeNumeroUnidadFormato : string = 'El número de unidad que intentas ingresar ya se encuentra registrado, por favor ingresa otro numero de unidad';
mensajeNumeroUnidadCampoObligatorio = 'El número de unidad es un campo obligatorio';
mensajeNumeroUnidadRegistrada = 'El número de unidad que has intentado registrar ya se encuentra asignado a otro carro, por favor registra la unidad con otro número'
mensajeCampoMarcaObligatorio = 'El campo Marca es obligario'

constructor(private carroServicio:CarroService,private router:Router,private _snackBar: MatSnackBar){}

ngOnInit(): void {
 this.obtenerCarros();
}

obtenerCarros(){
  this.carroServicio.obtenerListaCarro().subscribe(dato =>  {
    this.carroLista = dato;
  });
}


validandoDatos(listaCarros: Carro[], nuevoNumeroUnidad: number): boolean {
  
  this.convertirImagenesABase64();

  this.generalErrorFlag = false;
  const anyoActual = new Date().getFullYear();
    
  if (listaCarros.some(carro => carro.numeroUnidad == nuevoNumeroUnidad)) {
      this.generalErrorFlag = true;
      this.nonNumericNumUnidad = true;
  }

  if(this.carro.numeroUnidad === undefined || this.carro.numeroUnidad === null || this.carro.numeroUnidad === 0 || this.carro.numeroUnidad.toString().trim() == '') {
    this.noNumeroUnidad = true;
    this.generalErrorFlag = true;
}

  if (this.carro.marca === undefined || this.carro.marca === null ||  this.carro.marca === '') {
     this.noMarcaError = true;
     this.generalErrorFlag = true;
  }


  if(this.carro.modelo === undefined ||  this.carro.modelo === null ||   this.carro.modelo === '') {
      this.noModeloError = true;
      this.generalErrorFlag = true;
  }
 
  else {
  //trimeamos los inputs
  // this.trimInputs();
  // this.carro.modelo = this.carro.solo_marca.toUpperCase().concat(' ').concat(this.carro.solo_modelo.toUpperCase());
 
 }

  if(this.carro.anyo === undefined || this.carro.anyo ===null || this.carro.anyo === 0 || this.carro.anyo.toString().trim() == '') {
      this.noAnyoError = true;
      this.mensaje = 'El año es un campo obligatorio, por favor introduce el año del carro a registrar'
      this.generalErrorFlag = true;
  }


  else if((this.carro.anyo.toString().trim() != '')  &&  this.carro.anyo < 1900 || this.carro.anyo > anyoActual) {
    this.noAnyoError = true;
    this.mensaje = 'Año invalido, introduzca un año entre 1900 y ' + anyoActual;
    this.generalErrorFlag = true;
  }


  if(this.generalErrorFlag === true)
  return false;

  else
  return true;

}


convertirImagenesABase64(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.imagenes = [];
    const promises: Promise<void>[] = [];
    for (let i = 0; i < this.selectedFiles.length; i++) {
      promises.push(this.leerArchivoComoDataURL(this.selectedFiles[i]));
    }
    Promise.all(promises)
      .then(() => resolve())
      .catch(error => reject(error));
  });
}

async leerArchivoComoDataURL(file: File): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.imagenes.push(base64String);
      let imagen = new Imagen();
      imagen.imagenDesc = file.name;
      imagen.imagenUrl = base64String; // url
      imagen.imagen = base64String; // url
      this.imagenGuardar.push(imagen);
      resolve();
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

guardarCarro() {




  this.convertirImagenesABase64().then(() => {
    if (this.validandoDatos(this.carroLista, this.carro.numeroUnidad)) {

      console.log(this.carro);

      this.carro.imagenes = this.imagenGuardar;
      this.carroServicio.registrarCarro(this.carro).subscribe(dato => {
        console.log(dato);
        this._snackBar.open('Carro registrado con éxito.', '', {
          duration: 2000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.irListaCarro();
      }, error => console.log(error));
    }
  }).catch(error => {
    console.error('Error al convertir imágenes a base64:', error);
  });
}

private trimInputs(){
  if(this.carro.marca)
  this.carro.marca = this.carro.marca.trim();
  if(this.carro.modelo)
  this.carro.modelo = this.carro.modelo.trim();
}


irListaCarro() {
this.router.navigate(['/carros']);
}

onSubmit(){
  this.guardarCarro();
}


handleNonNumericCount(count: number , anyo: string) {
  (count >= 3 && anyo === 'anyo') ?   this.nonNumericError = true :  this.nonNumericError = false;
  (count >= 3 && anyo === 'consumo') ?   this.nonNumericConsumo = true :  this.nonNumericConsumo = false;
  (count >= 3 && anyo === 'numeroUni') ?   this.nonNumericNumUnidad = true :  this.nonNumericNumUnidad = false;
}

  onInputChange() {
    // Aquí puedes agregar la lógica que deseas ejecutar mientras escribes en el input.

        if(this.carro.marca != '' && this.carro.marca != undefined)
        this.noMarcaError = false;
    
        if(this.carro.modelo != '' && this.carro.modelo != undefined) 
          this.noModeloError = false;

        if(this.carro.anyo != undefined &&  this.carro.anyo.toString().trim()  != '')  
          this.noAnyoError = false;

        if(this.carro.numeroUnidad != undefined &&  this.carro.numeroUnidad.toString().trim() != '') 
          this.noNumeroUnidad = false;
  }



  onFileSelected(event:any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        // Verificar si el archivo no está ya en la lista
        if (!this.selectedFiles.some(existingFile => existingFile.name === file.name)) {
          this.selectedFiles.push(file);
        }
      }
    }

  }


  
  




}



