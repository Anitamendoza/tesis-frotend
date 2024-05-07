import { Component, OnInit } from '@angular/core';
import { CursoService } from '../services/courses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  profesores: any[] = [];

  constructor(private cursoService: CursoService, private router: Router) { }

  ngOnInit(): void {
    this.fetchProfesores();
  }

  fetchProfesores(): void {
    // Obtiene el ID del usuario logueado desde el almacenamiento de sesión
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      const usuarioId = usuario.id as string;
      // Llama al método del servicio para obtener IDs de profesores por ID de usuario
      this.cursoService.obtenerAlumnosPorUsuarioId(usuarioId).subscribe(
        (profesoresIds: any[]) => {
          console.log('Respuesta de obtenerProfesoresPorUsuarioId:', profesoresIds);
          // Para cada ID de profesor, llama al método del servicio para obtener los detalles del profesor
          profesoresIds.forEach(profesorId => {
            const profesorIdObj = profesorId as any;
            let profesorIdString: string;
  
            if (profesorIdObj.hasOwnProperty('Profesores_id')) {
              profesorIdString = profesorIdObj.Profesores_id.toString();
            } else {
              console.error('El objeto profesorId no tiene la propiedad "Profesores_id":', profesorId);
              return;
            }
  
            this.cursoService.obtenerProfesorPorId(profesorIdString).subscribe(
              (profesor: any) => {
                this.profesores.push(profesor);
              },
              (error) => {
                console.error('Error al obtener profesor por ID:', error);
              }
            );
          });
        },
        (error) => {
          console.error('Error al obtener IDs de profesores por usuario ID:', error);
        }
      );
    } else {
      console.error('No se encontró información de usuario en la sesión.');
    }
  }

  iniciarConversacion(profesorId: number): void {
    this.router.navigate(['/messages', profesorId]);
  }
}
