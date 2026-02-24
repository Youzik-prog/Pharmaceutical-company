import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Drug } from '../types/types';
import { CURRENT_DATE, DRUGS_API_URL } from '../constants/mainContants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DrugsService {

  private readonly apiUrl = DRUGS_API_URL;

  currentDate = CURRENT_DATE;

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

  getNonExpiredDrugs(currentDate: Date = this.currentDate): Observable<Drug[]> {
    return this.getDrugs().pipe(
      map((drugs: Drug[]) => 
        drugs
      .filter(drug => new Date(drug.endDate) >= currentDate)
      .sort((a, b) => +!(new Date(a.endDate) < new Date(b.endDate)))
      )
    );
  }
}
