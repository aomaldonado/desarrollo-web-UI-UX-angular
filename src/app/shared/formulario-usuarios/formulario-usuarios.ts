import { Component, signal, inject, OnInit } from '@angular/core';
import { Usuario } from '../../model/usuario';
import { UsuarioServicio } from '../../service/usuario-servicio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario-usuarios',
  imports: [FormsModule],
  templateUrl: './formulario-usuarios.html',
  styleUrl: './formulario-usuarios.css',
})
export class FormularioUsuarios implements OnInit {

  private usuarioService = inject(UsuarioServicio);

  listaUsuarios = signal<Usuario[]>([]);

  editando = false;

  nuevoUsuario: Usuario = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    console.log('Cargando usuarios desde Firebase...');
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        console.log('Usuarios recibidos:', usuarios);
        // Filtrar usuarios que no tengan nombre (registros vacíos guardados por error)
        const usuariosValidos = (usuarios || []).filter(u => u.nombre && u.nombre.trim() !== '');
        this.listaUsuarios.set(usuariosValidos);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        alert('Hubo un error al cargar los usuarios. Revisa la consola.');
      }
    });
  }

  registrarUsuario() {
    if (!this.nuevoUsuario.nombre || this.nuevoUsuario.nombre.trim() === '') {
      alert('Por favor, ingresa al menos el nombre de usuario.');
      return;
    }

    if (this.editando && this.nuevoUsuario.id) {
      this.usuarioService.putUsuario(this.nuevoUsuario.id, this.nuevoUsuario).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.nuevoUsuario = {nombre: '', email: '', telefono: '', direccion: ''};
          this.editando = false;
        },
        error: (err) => console.error('Error al actualizar en Firebase:', err)
      });
    } else {
      this.usuarioService.postUsuario(this.nuevoUsuario).subscribe({
        next: (res) => {
          const usuarioCreado = { ...this.nuevoUsuario, id: res.name };
          this.listaUsuarios.set([usuarioCreado, ...this.listaUsuarios()]);
          this.nuevoUsuario = {nombre: '', email: '', telefono: '', direccion: ''};
        },
        error: (err) => console.error('Error al guardar en Firebase:', err)
      });
    }
  }

  eliminarUsuario(id?: string) {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (err) => console.error('Error al eliminar en Firebase:', err)
      });
    }
  }

  editarUsuario(usuario: Usuario) {
    this.editando = true;
    this.nuevoUsuario = { ...usuario };
  }

  limpiarFormulario(){
    this.editando=false;
    this.nuevoUsuario={nombre:'',email:'',direccion:''};
  }
}
