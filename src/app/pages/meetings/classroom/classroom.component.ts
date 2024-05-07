import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CursoService } from '../../students/services/courses.service';
import { mergeMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';


interface ClassroomMeetingResponse {
  sala: string;
}

interface MeetingSchedule {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  sala: string;
}

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css']
})
export class ClassroomComponent implements OnInit {
  userId: string | null = null;
  reuniones: MeetingSchedule[] = [];

  constructor(private cursoService: CursoService, private router: Router) {}

  ngOnInit(): void {
    this.getUserIdFromSession();
  }
  
  getUserIdFromSession(): void {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.userId = usuario.id as string;
      console.log('ID del usuario:', this.userId);
      if (usuario.rol === 1) {
        this.obtenerReunionesAlumno();
      } else if (usuario.rol === 2) {
        this.obtenerReunionesProfesor();
      } else {
        console.error('Rol de usuario no válido');
      }
    } else {
      console.error('ID de usuario no encontrado en la sesión');
    }
  }
  obtenerReunionesAlumno(): void {
    // Primero, obtenemos las inscripciones del alumno
    this.cursoService.obtenerInscripcionesPorAlumnoId(this.userId!).pipe(
      mergeMap((inscripciones: any[]) => {
        // Para cada inscripción, creamos un observable para obtener la información del horario asociado
        const observables = inscripciones.map(inscripcion => {
          // Utilizamos el Horario_id de la inscripción para obtener la información del horario
          return this.cursoService.obtenerHorariosPorId(inscripcion.Horario_id).pipe(
            mergeMap((horario: any) => {
              // Utilizamos el Profesores_id de la inscripción para obtener la información del profesor
              return this.cursoService.obtenerProfesorPorId(inscripcion.Profesores_id).pipe(
                map((response: ClassroomMeetingResponse) => {
                  // Creamos un objeto de reunión con la información obtenida
                  const sala = response.sala;
                  console.log('Sala de reunión obtenida:', sala);
                  const reunion: MeetingSchedule = {
                    fecha: horario.fecha,
                    horaInicio: horario.hora_inicio,
                    horaFin: horario.hora_fin,
                    sala: sala
                  };
                  return reunion;
                })
              );
            })
          );
        });
        // Combinamos todos los observables en uno solo para manejarlos de manera concurrente
        return forkJoin(observables);
      })
    ).subscribe((reuniones: MeetingSchedule[]) => {
      // Una vez que se completan todas las solicitudes, asignamos las reuniones al arreglo del componente
      this.reuniones = reuniones;
    }, (error) => {
      // Manejamos cualquier error que ocurra durante el proceso
      console.error('Error al obtener las reuniones:', error);
    });
  }
  
  obtenerReunionesProfesor(): void {
    // Primero, obtenemos las inscripciones del profesor logueado
    this.cursoService.obtenerProfesoresPorUsuarioId(this.userId!)
      .pipe(
        mergeMap((inscripciones: any[]) => {
          console.log('Inscripciones obtenidas:', inscripciones);
          // Obtenemos los IDs de los horarios asociados a las inscripciones del profesor
          const horariosIds = inscripciones.map(inscripcion => inscripcion.Horario_id);
          console.log('IDs de horarios extraídos:', horariosIds);
          // Luego, obtenemos los detalles de los horarios utilizando los IDs
          return this.cursoService.obtenerHorariosPorIds(horariosIds);
        }),
        mergeMap((horarios: any[]) => {
          console.log('Horarios obtenidos:', horarios);
          // Para cada horario, creamos un observable para obtener la información del profesor asociado
          const observables = horarios.map(horario => {
            // Llamamos al servicio para obtener la información del profesor asociado al horario
            return this.cursoService.obtenerProfesorPorId(this.userId!).pipe(
              map((response: ClassroomMeetingResponse) => {
                console.log('Información del profesor obtenida:', response);
                // Creamos un objeto de reunión con la información obtenida
                const reunion: MeetingSchedule = {
                  fecha: horario.fecha,
                  horaInicio: horario.hora_inicio,
                  horaFin: horario.hora_fin,
                  sala: response.sala
                };
                return reunion;
              })
            );
          });
          console.log('Observables de reuniones creados:', observables);
          // Combinamos todos los observables en uno solo para manejarlos de manera concurrente
          return forkJoin(observables);
        })
      )
      .subscribe(
        (reuniones: MeetingSchedule[]) => {
          console.log('Reuniones obtenidas:', reuniones);
          // Una vez que se completan todas las solicitudes, asignamos las reuniones al arreglo del componente
          this.reuniones = reuniones;
        },
        (error) => {
          // Manejamos cualquier error que ocurra durante el proceso
          console.error('Error al obtener las reuniones del profesor:', error);
        }
      );
  }
  
  



  ingresarReunion(url: string) {
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('No se pudo abrir la reunión: URL no válida');
    }
  }
}
