import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert';
import { Medico } from 'src/app/models/medico.model';


@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos( desde: number = 0 ) {

    let url = URL_SERVICIOS + '/medico?desde=' + desde;

    return this.http.get( url )
      .pipe(map((resp: any) => {
        this.totalMedicos = resp.total;
        return resp.medicos;
      } ));

  }
  cargarMedico( id: string ) {
    let url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get( url )
            .pipe(map((resp: any) => resp.medico));

  }
  buscarMedico( termino: string ) {

    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get( url )
            .pipe(map( (resp: any) => resp.medicos ));
      }
  borrarMedico( id: string ) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete( url )
            .pipe(map(( resp: any ) => {
              swal( 'Medico borrado', 'Medico borrado correctamente', 'success');
              return resp;
            }));
  }

  guardarMedico( medico: Medico ) {

    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {
      // actualizando

      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, medico )
      .pipe(map((resp: any) => {
        swal('Medico actualizado', medico.nombre, 'success');
        return resp.medico;
      }));

    } else {
  // creando

      url += '?token=' + this._usuarioService.token;
      return this.http.post( url, medico )
            .pipe(map((resp: any) => {
              swal('Medico creado', medico.nombre, 'success');
              return resp.medico;
            }));
    }

  }
  }
