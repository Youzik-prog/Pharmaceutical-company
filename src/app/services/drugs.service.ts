import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Drug } from '../types/types';
import { API_URL } from '../constants/mainContants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DrugsService {
  
  private readonly apiUrl = API_URL;

  constructor(private http: HttpClient) { }

  /**
   * @param amount - Необязательный параметр. Если он не указан, то вернётся весь список лекартсв.
   */
  getDrugs(amount?: number): Observable<Drug[]> { 
    return this.http.get<Drug[]>(this.apiUrl).pipe(
      map((drugs: Drug[]) => amount ? drugs.slice(0, amount) : drugs)
    );
  }

  getAllDrugsAmount(): Observable<number> {
    return this.http.get<Drug[]>(this.apiUrl).pipe(
      map((drugs: Drug[]) => drugs.length)
    );
  }
}
