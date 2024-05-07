import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  private apiUrlHorarios = 'http://localhost:4000/api/horarios';
  private apiUrlProfesores = 'http://localhost:4000/api/profesores';
  private apiUrlInscripciones = 'http://localhost:4000/api/inscripciones'; // Nueva URL para filtrar por inscripciones
  private apiUrlAlumnos = 'http://localhost:4000/api/alumnos';
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
  // Método para obtener alumnos por ID de usuario (filtrando por inscripciones)
  obtenerAlumnosPorUsuarioId(usuarioId: string): Observable<any[]> {
    const url = `${this.apiUrlInscripciones}/alumno/${usuarioId}`;
    return this.http.get<any[]>(url);
  }
  // Método para obtener profesores por ID de usuario (filtrando por inscripciones)
  obtenerProfesoresPorUsuarioId(usuarioId: string): Observable<any[]> {
    const url = `${this.apiUrlInscripciones}/profesor/${usuarioId}`;
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
  // Método para obtener un alumno por su ID
  obtenerAlumnoPorId(id: string): Observable<any> {
    const url = `${this.apiUrlAlumnos}/${id}`;
    return this.http.get<any>(url);
  }

  // En el servicio CursoService
  actualizarAlumno(alumnoId: string, datos: any) {
    const url = `${this.apiUrlAlumnos}/${alumnoId}`;
    return this.http.put(url, datos);
  }
  // En el servicio CursoService
  actualizarProfesor(profesorId: string, datos: any) {
    const url = `${this.apiUrlProfesores}/editar/${profesorId}`;
    return this.http.put(url, datos);
  }

  obtenerInscripcionesPorAlumnoId(alumnoId: string): Observable<any[]> {
    const url = `${this.apiUrlInscripciones}/alumno/${alumnoId}`;
    return this.http.get<any[]>(url);
  }
  obtenerHorariosPorIds(horariosIds: string[]): Observable<any[]> {
    const url = `${this.apiUrlHorarios}/filtrar/ids`;
    const params = { ids: horariosIds.join(',') };
    return this.http.get<any[]>(url, { params });
  }
  

  obtenerHorarios(): Observable<any[]> {
    const url = `${this.apiUrlHorarios}`;
    return this.http.get<any[]>(url);
  }
  obtenerIdsHorariosPorAlumnoId(alumnoId: string): Observable<string[]> {
    const url = `${this.apiUrlInscripciones}/alumno/${alumnoId}`;
    return this.http.get<string[]>(url);
  }
  
}
