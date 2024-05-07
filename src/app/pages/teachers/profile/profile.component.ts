import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from '../../students/services/courses.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventClickArg } from '@fullcalendar/core';
import { Router, NavigationExtras } from '@angular/router';
import { TeacherService } from '../teacher.service';

interface ExtendedProps {
  horarioId: string;
  profesorId: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profesorId: string | null = null;
  profesor: any;
  horarios: any[] = [];
  editMode = false; 
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek', // Cambiar a la vista semanal de timeGrid
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay', // Agregar botones para cambiar entre vista semanal y diaria
    },
    slotMinTime: '08:00:00', // Hora de inicio personalizada
    slotMaxTime: '22:00:00', // Hora de finalización personalizada
    allDaySlot: false,
    weekends: false, // Ocultar los fines de semana
    plugins: [dayGridPlugin, timeGridPlugin],
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      this.profesorId = usuario.id as string;
      this.obtenerProfesor(); // Llama a la función para obtener los detalles del profesor
    } else {
      console.error('ID de profesor no encontrado en la sesión');
    }
  }


  obtenerProfesor(): void {
    this.cursoService.obtenerProfesorPorId(this.profesorId!).subscribe(
      (data) => {
        this.profesor = data;
        this.obtenerHorariosProfesor();
      },
      (error) => {
        console.error('Error al obtener el profesor:', error);
      }
    );
  }
  guardarCambios() {
    this.cursoService.actualizarProfesor(this.profesorId!, this.profesor)
      .subscribe(
        () => {
          // Manejar la respuesta exitosa
          this.editMode = false; // Salir del modo de edición
        },
        (error) => {
          // Manejar el error
          console.error(error);
        }
      );
  }

  handleEventClick(arg: EventClickArg) {
    this.navigateToRegistration(arg);
  }
  obtenerHorariosProfesor(): void {
    this.cursoService.obtenerHorariosPorProfesor(this.profesorId!).subscribe(
      (data) => {
        this.horarios = data;
        this.calendarOptions.events = this.horarios.map((horario) => ({
          title: horario.titulo,
          start: horario.fecha + 'T' + horario.hora_inicio,
          end: horario.fecha + 'T' + horario.hora_fin,
          extendedProps: {
            horarioId: horario.id,
            profesorId: this.profesorId,
          },
        }));
      },
      (error) => {
        console.error('Error al obtener los horarios del profesor:', error);
      }
    );
  }
  navigateToRegistration($event: EventClickArg): void {
    const eventInfo = $event.event; 
    const extendedProps = eventInfo.extendedProps as ExtendedProps; 
    const horarioId = extendedProps.horarioId;
    const profesorId = extendedProps.profesorId;
  
    console.log('Horario ID:', horarioId);
    console.log('Profesor ID:', profesorId);
  
    this.router.navigate(['/confirmation', horarioId, profesorId]);
  }
}
