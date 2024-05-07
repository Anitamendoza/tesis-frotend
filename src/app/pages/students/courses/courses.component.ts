// import { Component, OnInit } from '@angular/core';
// import { CursoService } from '../services/courses.service';
// @Component({
//   selector: 'app-courses',
//   templateUrl: './courses.component.html',
//   styleUrls: ['./courses.component.css']
// })
// export class CoursesComponent implements OnInit {
//   cursos: any[] = [];

//   constructor(private cursoService: CursoService) { }

//   ngOnInit(): void {
//     this.obtenerCursos();
//   }

//   obtenerCursos(): void {
//     this.cursoService.obtenerCursos().subscribe(
//       (data: any[]) => {
//         this.cursos = data;
//       },
//       error => {
//         console.error('Error al obtener los cursos:', error);
//       }
//     );
//   }
// }