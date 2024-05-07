import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CalendarStudentService {

  private apiUrl = 'http://localhost:4000/api/horarios';

  constructor(private http: HttpClient) { }

  obtenerHorarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

