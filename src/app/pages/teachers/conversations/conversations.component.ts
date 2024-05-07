import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit {
  alumnos: any[] = [];

  constructor(private teacherService: TeacherService, private router: Router) { }

  ngOnInit(): void {
    this.fetchAlumnos();
  }

  fetchAlumnos(): void {
    // Obtiene el ID del usuario logueado desde el almacenamiento de sesión
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      const usuarioId = usuario.id as string;
      // Llama al método del servicio para obtener IDs de alumnos por ID de usuario
      this.teacherService.obtenerProfesoresPorUsuarioId(usuarioId).subscribe(
        (alumnosIds: any[]) => {
          console.log('Respuesta de obtenerProfesoresPorUsuarioId:', alumnosIds);
          // Para cada ID de alumno, llama al método del servicio para obtener los detalles del alumno
          alumnosIds.forEach(alumnoId => {
            const alumnoIdObj = alumnoId as any;
            let alumnoIdString: string;
  
            if (alumnoIdObj.hasOwnProperty('Alumnos_id')) {
              alumnoIdString = alumnoIdObj.Alumnos_id.toString();
            } else {
              console.error('El objeto alumnoId no tiene la propiedad "Alumnos_id":', alumnoId);
              return;
            }
  
            this.teacherService.obtenerAlumnoPorId(alumnoIdString).subscribe(
              (alumno: any) => {
                this.alumnos.push(alumno);
              },
              (error) => {
                console.error('Error al obtener alumno por ID:', error);
              }
            );
          });
        },
        (error) => {
          console.error('Error al obtener IDs de alumnos por usuario ID:', error);
        }
      );
    } else {
      console.error('No se encontró información de usuario en la sesión.');
    }
  }

  iniciarConversacion(alumnoId: number): void {
    // Aquí podrías navegar a la conversación con el profesor seleccionado
    // Por ejemplo:
    this.router.navigate(['/message', alumnoId]);
  }
}
