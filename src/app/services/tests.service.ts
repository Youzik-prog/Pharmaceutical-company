import { inject, Injectable } from '@angular/core';
import { TESTS_API_URL } from '../constants/mainContants';
import { HttpClient } from '@angular/common/http';
import { filter, map, Observable } from 'rxjs';
import { Test } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class TestsService {

  private http = inject(HttpClient);
  
  private readonly apiUrl = TESTS_API_URL;

  getAllTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.apiUrl);
  }

  getPeriodTests(from: Date, to: Date): Observable<Test[]> {
    return this.http.get<Test[]>(this.apiUrl).pipe(
      map(tests => tests.filter(test => {
        const date = new Date(test.date);
        return date > from && date < to
      }))
    );
  }

  // getTotalTestedDrugs(): Observable {

  // }
}
