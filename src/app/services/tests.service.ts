import { inject, Injectable } from '@angular/core';
import { TESTS_API_URL } from '../constants/mainContants';
import { HttpClient } from '@angular/common/http';
import { filter, map, Observable } from 'rxjs';
import { Stat, Test } from '../types/types';
import { substractDaysFromDate } from '../utils/functions';

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
        return date >= from && date < to
      }))
    );
  }

  getTotalTestedDrugsStat(from: Date, to: Date): Observable<Stat> {
    return this.getPeriodTests(from, to).pipe(
      map(tests => {
        const totalTests = tests.map(test => test.tests);

        const totalCompletedTests = tests.map(test => test.completed);

        return {
          startDate: from,
          endDate: substractDaysFromDate(to, 1),
          dataset: totalTests,
          dataset2: totalCompletedTests
        }
      })
    )
  }
}
