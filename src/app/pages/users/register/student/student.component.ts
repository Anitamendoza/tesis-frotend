import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css',  './adminlte.min.css']
})
export class StudentComponent {

  alumno: any = {};
  apoderado: any = {};
  direccion: any = {};

constructor(private http: HttpClient, private router: Router) {}

  submitForm() {
    const data = {
      email: this.alumno.email,
      usuario: this.alumno.usuario,
      password: this.alumno.password,
      nombre: this.alumno.nombre,
      apellido: this.alumno.apellido,
      genero: this.alumno.genero,
      telefono: this.alumno.telefono,
      fecha_nac: this.alumno.fecha_nac,
      Roles_id: 1,
      apoderado: {
        dni: this.apoderado.dni,
        nombre: this.apoderado.nombre,
        apellido: this.apoderado.apellido,
        email: this.apoderado.email,
        fecha_nac: this.apoderado.fecha_nac,
        genero: this.apoderado.genero,
        telefono: this.apoderado.telefono
      },
      direccion: {
        calle: this.direccion.calle,
        distrito: this.direccion.distrito,
        ciudad: this.direccion.ciudad,
        codigo_postal: this.direccion.codigo_postal
      }
    };
  this.http.post<any>('http://localhost:4000/api/alumnos', data)
    .subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        alert('Alumno creado correctamente. ID del alumno: ' + response.id);
        this.router.navigate(['/otra-pagina']);
      },
      error => {
        console.error('Error al enviar los datos:', error);
        alert('Error al crear el alumno. Por favor, inténtalo de nuevo más tarde.');
      }
    );
  }
}
