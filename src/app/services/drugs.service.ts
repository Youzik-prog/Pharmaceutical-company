import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Drug } from '../types/types';
import { API_URL } from '../constants/mainContants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DrugsService {
  
  private readonly apiUrl = API_URL;

  constructor(private http: HttpClient) { }

  getAllDrugs(): Observable<Drug[]> { 
    return this.http.get<Drug[]>(this.apiUrl);
  }
}
