import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { CursoService } from '../../../students/services/courses.service';
import { CalendarOptions, DateSelectArg, EventApi } from '@fullcalendar/core'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Horario {
  titulo: string | null;
  dia_semana: number | null;
  hora_inicio: string | null;
  hora_fin: string | null;
  fecha: string | null;
  duracion: number | null;
  profesores_id: number | null;
}

interface EventoSeleccionado {
  startStr: string;
  endStr: string;
  originalColor: string; // Nuevo campo para guardar el color original
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  profesorId: number | null = null;
  selectedEvents: EventoSeleccionado[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    weekends: false,
    plugins: [timeGridPlugin, interactionPlugin],
    selectable: true,
    unselectAuto: false,
    select: this.handleDateSelect.bind(this)
  };

  constructor(private route: ActivatedRoute, private router: Router, private cursoService: CursoService) { }

  ngOnInit(): void {
    const profesorIdParam = this.route.snapshot.paramMap.get('profesorId');
    if (profesorIdParam !== null) {
      this.profesorId = parseInt(profesorIdParam, 10);
    }
  }
  handleDateSelect(selectInfo: DateSelectArg): void {
    const startStr = selectInfo.startStr;
    const endStr = selectInfo.endStr;
    
    const calendarApi = selectInfo.view.calendar;
    const defaultBackgroundColor = '#FBB311'; // Color de fondo predeterminado
    const alternateBackgroundColor = '#ffc107'; // Color de fondo alternativo
    
    const eventIndex = this.selectedEvents.findIndex(event => {
      return event.startStr === startStr && event.endStr === endStr;
    });
    
    if (eventIndex === -1) {
      // Si el evento no está seleccionado, lo añadimos a la lista y lo coloreamos
      this.selectedEvents.push({ startStr, endStr, originalColor: defaultBackgroundColor });
      calendarApi.addEvent({
        start: startStr,
        end: endStr,
        display: 'background',
        color: '#35502d' // Color de selección
      });
    } else {
      // Si el evento ya está seleccionado, lo eliminamos de la lista y lo descoloreamos
      const deselectedEvent = this.selectedEvents[eventIndex];
      this.selectedEvents.splice(eventIndex, 1);
      calendarApi.getEvents().forEach((event: EventApi) => {
        if (event.start?.toISOString() === startStr && event.end?.toISOString() === endStr) {
          event.setProp('display', false); // Oculta el evento
          event.setProp('color', deselectedEvent.originalColor); // Restaura el color original
        }
      });
    }
  }
  
  
  

  guardarHorarios(): void {
    if (!this.profesorId) {
      console.error('Profesores_id no está definido');
      return;
    }

    // Envía los horarios seleccionados al servicio
    this.selectedEvents.forEach(async (event) => {
      const payload = {
        Profesores_id: this.profesorId,
        horarios: [{
          titulo: 'Disponible',
          dia_semana: new Date(event.startStr).getDay(),
          hora_inicio: event.startStr,
          hora_fin: event.endStr,
          fecha: event.startStr.substring(0, 10),
          duracion: null,
          profesores_id: this.profesorId ?? 1
        }]
      };

      try {
        const response = await this.cursoService.registrarHorario(payload).toPromise();
        console.log('Horario registrado exitosamente:', response);
      } catch (error) {
        console.error('Error al registrar horario:', error);
      }
    });

    // Limpiar la lista de eventos seleccionados después de enviarlos
    this.selectedEvents = [];
    this.router.navigate(['/conversations']);
  }
}
