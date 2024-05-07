import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ClassroomMeetingResponse {
  meetingUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private apiUrl = 'http://localhost:4000/api/meetings'; // URL de tu API

  constructor(private http: HttpClient) { }

  createClassroomMeeting(teacherId: string): Observable<ClassroomMeetingResponse> {
    return this.http.post<ClassroomMeetingResponse>(`${this.apiUrl}/classroom/${teacherId}`, {});
  }
}