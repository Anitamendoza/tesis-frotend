
import { Component, OnInit } from '@angular/core';
import { CursoService } from '../services/courses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  profesores: any[] = [];
  mostrarCantidad: number = 10;
  cargandoMas: boolean = false;
  filtroEspecialidad: string = ''; // Variable para almacenar la especialidad seleccionada
  usuarioLogueado: any | null = null; // Definición de la propiedad usuarioLogueado

  constructor(private router: Router, private cursoService: CursoService) {}

  ngOnInit(): void {
    this.getUserData(); // Llamada al método para obtener los datos del usuario logueado
    this.obtenerProfesores();
  }

  obtenerProfesores(): void {
    this.cursoService.obtenerProfesores().subscribe(
      (data) => {
        this.profesores = data.filter(profesor => 
          profesor.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase())
        ).slice(0, this.mostrarCantidad);
      },
      (error) => {
        console.error('Error al obtener profesores:', error);
      }
    );
  }

  cargarMasProfesores(): void {
    this.cargandoMas = true;
    this.mostrarCantidad += 10;
    this.obtenerProfesores();
    this.cargandoMas = false;
  }

  filtrarPorEspecialidad(especialidad: string): void {
    this.filtroEspecialidad = especialidad;
    this.mostrarCantidad = 10; // Resetear la cantidad mostrada al aplicar el filtro
    this.obtenerProfesores();
  }

  buscarPorEspecialidad(): void {
    this.obtenerProfesores();
  }
  
  irAPerfil(id: string): void {
    this.router.navigate(['/teacherProfile', id]);
  }

  getUserData() {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const userData = JSON.parse(usuarioString);
      this.usuarioLogueado = {
        usuario: userData.usuario,
        nombre: userData.nombre,
        rol: userData.rol,
        foto: userData.foto,
      };
    }
  }
}


// import { Component, OnInit } from '@angular/core';
// import { CursoService } from '../services/courses.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css'],
// })
// export class HomeComponent implements OnInit {
//   profesores: any[] = [];
//   mostrarCantidad: number = 10;
//   cargandoMas: boolean = false;
//   filtroEspecialidad: string = ''; // Variable para almacenar la especialidad seleccionada

//   constructor(private router: Router, private cursoService: CursoService) {}

//   ngOnInit(): void {
//     this.obtenerProfesores();
//   }

//   obtenerProfesores(): void {
//     this.cursoService.obtenerProfesores().subscribe(
//       (data) => {
//         this.profesores = data.filter(profesor => 
//           profesor.especialidad.toLowerCase().includes(this.filtroEspecialidad.toLowerCase())
//         ).slice(0, this.mostrarCantidad);
//       },
//       (error) => {
//         console.error('Error al obtener profesores:', error);
//       }
//     );
//   }

//   cargarMasProfesores(): void {
//     this.cargandoMas = true;
//     this.mostrarCantidad += 10;
//     this.obtenerProfesores();
//     this.cargandoMas = false;
//   }

//   filtrarPorEspecialidad(especialidad: string): void {
//     this.filtroEspecialidad = especialidad;
//     this.mostrarCantidad = 10; // Resetear la cantidad mostrada al aplicar el filtro
//     this.obtenerProfesores();
//   }

//   buscarPorEspecialidad(): void {
//     this.obtenerProfesores();
//   }
//   irAPerfil(id: string): void {
//     this.router.navigate(['/teacherProfile', id]);
//   }
// }


// this.obtenerCursos();
// cursos: any[] = []; // Inicialización en el lugar
// obtenerCursos(): void {
//   this.cursoService.obtenerCursos().subscribe(
//     data => {
//       this.cursos = data;
//     },
//     error => {
//       console.error('Error al obtener cursos:', error);
//     }
//   );
// }
