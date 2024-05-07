import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrlHorarios = 'http://localhost:4000/api/horarios';
  private apiUrlProfesores = 'http://localhost:4000/api/profesores';
  private apiUrlAlumnos = 'http://localhost:4000/api/alumnos';
  private apiUrlInscripciones = 'http://localhost:4000/api/inscripciones'; // Nueva URL para filtrar por inscripciones

  constructor(private http: HttpClient) {}

  // Método para obtener todos los profesores
  obtenerProfesores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlProfesores);
  }

  // Método para obtener un profesor por su ID
  obtenerProfesorPorId(id: string): Observable<any> {
    const url = `${this.apiUrlProfesores}/filtrar/${id}`;
    return this.http.get<any>(url);
  }

  // Método para obtener profesores por ID de usuario (filtrando por inscripciones)
  obtenerProfesoresPorUsuarioId(usuarioId: string): Observable<any[]> {
    const url = `${this.apiUrlInscripciones}/profesor/${usuarioId}`;
    return this.http.get<any[]>(url);
  }
 // Método para obtener todos los alumnos
 obtenerAlumnos(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrlAlumnos);
}
   // Método para obtener un alumno por su ID
   obtenerAlumnoPorId(id: string): Observable<any> {
    const url = `${this.apiUrlAlumnos}/${id}`;
    return this.http.get<any>(url);
  }

  // Método para obtener alumnos por ID de usuario (filtrando por inscripciones)
  obtenerAlumnosPorUsuarioId(usuarioId: string): Observable<any[]> {
    const url = `${this.apiUrlInscripciones}/alumno/${usuarioId}`;
    return this.http.get<any[]>(url);
  }

  obtenerHorariosPorProfesor(idProfesor: string): Observable<any[]> {
    const url = `${this.apiUrlHorarios}/profesor/${idProfesor}`;
    return this.http.get<any[]>(url);
  }
  obtenerHorariosPorId(horarioId: string): Observable<any[]> {
    const url = `${this.apiUrlHorarios}/${horarioId}`;
    return this.http.get<any[]>(url);
  }
  // Método para registrar un horario
  registrarHorario(horario: any): Observable<any> {
    return this.http.post<any>(this.apiUrlHorarios, horario);
  }
  registrarInscripcion(inscripcion: any): Observable<any> {
    const url = 'http://localhost:4000/api/inscripciones';
    return this.http.post(url, inscripcion);
  }
}
