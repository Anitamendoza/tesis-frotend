import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css', './adminlte.min.css']
})
export class TeacherComponent {

  profesores: any = {};
  educativos: any = {};
  direccion: any = {};
  selectedFile: File | null = null; // Inicializar selectedFile como null


  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any) {
    if (event.target.files.length > 0) { // Verificar si se seleccionó algún archivo
      this.selectedFile = event.target.files[0]; // Asignar el archivo seleccionado
    }
  }

  submitForm() {
    if (this.selectedFile) { // Verificar si se ha seleccionado un archivo antes de enviar el formulario
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      // Upload the image to your Node.js server
      this.http.post<any>('http://localhost:4000/api/imagen/upload-image', formData)
       .subscribe(
          response => {
           // Now response.imageUrl contains the URL of the uploaded image
            this.profesores.foto = response.imageUrl; // Assign the image URL to profesores.foto
            this.saveProfesor(); // Call saveProfesor() function to save the profesor with image URL
         },
          error => {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen. Por favor, inténtalo de nuevo más tarde.');
          }
        );
    } else {
    console.error('No se ha seleccionado ningún archivo.');
    alert('Por favor, seleccione una imagen antes de enviar el formulario.');
  }
}


  saveProfesor() {
    const data = {
      email: this.profesores.email,
      usuario: this.profesores.usuario,
      password: this.profesores.password,
      nombre: this.profesores.nombre,
      apellido: this.profesores.apellido,
      genero: this.profesores.genero,
      dni: this.profesores.dni,
      telefono: this.profesores.telefono,
      fecha_nac: this.profesores.fecha_nac,
      Roles_id: 2,
      especialidad: this.profesores.especialidad,
      foto:this.profesores.foto,
      educativos: {
        nombre: this.educativos.nombre,
        institucion: this.educativos.institucion,
        fecha_obtencion: this.educativos.fecha_obtencion,
        pais_institucion: this.educativos.pais_institucion,
        nivel_educacion: this.educativos.nivel_educacion
      },
      direccion: {
        calle: this.direccion.calle,
        distrito: this.direccion.distrito,
        ciudad: this.direccion.ciudad,
        codigo_postal: this.direccion.codigo_postal
      }
    };
  this.http.post<any>('http://localhost:4000/api/profesores', data)
    .subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        alert('Profesor creado correctamente');
        // this.router.navigate(['/otra-pagina']);
        this.router.navigate(['/calendarRegister', response.usuario.id]);
      },
      error => {
        console.error('Error al enviar los datos:', error);
        alert('Error al crear el profesor. Por favor, inténtalo de nuevo más tarde.');
      }
    );
  }
}


// export class TeacherComponent {

//   profesores: any = {};
//   educativos: any = {};
//   direccion: any = {};

// constructor(private http: HttpClient, private router: Router) {}

// submitForm() {
//   const data = {
//     email: this.profesores.email,
//     usuario: this.profesores.usuario,
//     password: this.profesores.password,
//     nombre: this.profesores.nombre,
//     apellido: this.profesores.apellido,
//     genero: this.profesores.genero,
//     dni: this.profesores.dni,
//     telefono: this.profesores.telefono,
//     fecha_nac: this.profesores.fecha_nac,
//     Roles_id: 2,
//     especialidad: this.profesores.especialidad,
//     // foto:this.profesor.foto,
//     foto: "Imagen de un profesor",
//     educativos: {
//       nombre: this.educativos.nombre,
//       institucion: this.educativos.institucion,
//       fecha_obtencion: this.educativos.fecha_obtencion,
//       pais_institucion: this.educativos.pais_institucion,
//       nivel_educacion: this.educativos.nivel_educacion
//     },
//     direccion: {
//       calle: this.direccion.calle,
//       distrito: this.direccion.distrito,
//       ciudad: this.direccion.ciudad,
//       codigo_postal: this.direccion.codigo_postal
//     }
//   };
// this.http.post<any>('http://localhost:4000/api/profesores', data)
//   .subscribe(
//     response => {
//       console.log('Respuesta del servidor:', response);
//       alert('Profesor creado correctamente. ID del profesor: ' + response.id);
//       this.router.navigate(['/otra-pagina']);
//     },
//     error => {
//       console.error('Error al enviar los datos:', error);
//       alert('Error al crear el profesor. Por favor, inténtalo de nuevo más tarde.');
//     }
//   );
// }