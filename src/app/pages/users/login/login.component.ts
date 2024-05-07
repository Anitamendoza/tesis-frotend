import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { Usuario } from 'src/app/models/users';
import { DataLoginService } from 'src/app/services/data-login.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './adminlte.min.css' ],
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  mensaje: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  submitForm() {
    const data = { usuario: this.usuario, password: this.password };
    this.http.post<any>('http://localhost:4000/api/usuarios/auth', data).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        if (response.mensaje === 'OK') {
          // Almacena los datos de sesión en sessionStorage
          sessionStorage.setItem('token', response.token);
          // sessionStorage.setItem('usuario', JSON.stringify(response.usuario));
          sessionStorage.setItem('usuario', JSON.stringify({ ...response.usuario, rol: response.rol }));
          let navigationExtras: NavigationExtras = {
            state: { usuario: response.usuario },
          };

          if (response.rol === 1) {
            console.log('Redirigiendo al componente del alumno');
            this.router.navigate(['/home'], navigationExtras);
          } else if (response.rol === 2) {
            console.log('Redirigiendo al componente del profesor');
            this.router.navigate(['/conversations'], navigationExtras);
          }
        } else {
          console.log('Credenciales incorrectas');
          this.mensaje = 'Credenciales incorrectas';
        }
      },
      (error) => {
        console.error('Error al enviar los datos:', error);
        this.mensaje = 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
      }
    );
  }
}


  // submitForm() {
  //   const data = {
  //     usuario: this.usuario,
  //     password: this.password,
  //   };

  //   this.http
  //     .post<any>('http://localhost:4000/api/usuarios/auth', data)
  //     .subscribe(
  //       (response) => {
  //         if (response.mensaje === 'OK') {
  //           // Redirigir al componente correspondiente
  //           if (response.rol === 1) {
  //             // Redirigir al componente del alumno y pasar la información del usuario
  //             this.router.navigate(['/coursesStudent'], {
  //               state: { usuario: response.usuario },
  //             });
  //           } else if (response.rol === 2) {
  //             // Redirigir al componente del profesor y pasar la información del usuario
  //             this.router.navigate(['/coursesStudent'], {
  //               state: { usuario: response.usuario },
  //             });
  //           }
  //         } else {
  //           this.mensaje = 'Credenciales incorrectas';
  //         }
  //       },
  //       (error) => {
  //         console.error('Error al enviar los datos:', error);
  //         this.mensaje =
  //           'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
  //       }
  //     );
  // }