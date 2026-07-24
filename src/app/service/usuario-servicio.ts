import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicio {
  private http = inject(HttpClient);

  private API_USUARIOS = 'https://andres-c92ea.firebaseio.com/usuarios';

  //METODO POST
  postUsuario(usuario: Usuario): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(`${this.API_USUARIOS}.json`, usuario);
  }

  //METODO GET
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Record<string, Usuario>>(`${this.API_USUARIOS}.json`).pipe(
      map(res => {
        const usuarios: Usuario[] = [];
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            usuarios.push({ ...res[key], id: key });
          }
        }
        return usuarios;
      })
    );
  }

  //METODO PUT (Actualizar)
  putUsuario(id: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_USUARIOS}/${id}.json`, usuario);
  }

  //METODO DELETE (Eliminar)
  deleteUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.API_USUARIOS}/${id}.json`);
  }
}
