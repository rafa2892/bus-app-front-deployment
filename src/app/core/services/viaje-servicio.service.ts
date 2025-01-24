import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Viaje} from '../models/viaje';
import {Observable} from "rxjs";
import { Conductor } from '../models/conductor';


@Injectable({
  providedIn: 'root'
})
export class ViajeServicioService {

  //Obtiene el listado de Carros en el back
  private baseUrl = "http://localhost:8080/api/v1/viajes";

  constructor(private httpClient : HttpClient) { }

  //Este método nos funciona para obtener los listados de carro
  obtenerListaViaje():Observable<Viaje[]> {
    return this.httpClient.get<Viaje[]>(`${this.baseUrl}`);
  }

  //Este método nos funciona para regitrar un carro
  registrarViaje(viaje:Viaje) : Observable<Object>{
    return this.httpClient.post(`${this.baseUrl}`, viaje);
  }

  obtenerListaViajePorConductor(id: number): Observable<Viaje[]> {
    return this.httpClient.get<Viaje[]>(`${this.baseUrl}/conductor/${id}`);
  }

  obtenerViajeById(id: number): Observable<Viaje> {
    return this.httpClient.get<Viaje>(`${this.baseUrl}/${id}`);
  }

  eliminar(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
  
  

}