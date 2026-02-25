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

  getTestByDay(day: Date): Observable<Test | undefined> {
    return this.http.get<Test[]>(this.apiUrl).pipe(
      map((tests: Test[]) =>
        tests.find(test => new Date(test.date).getTime() === day.getTime())
      )
    );
  }

  getTotalTestedDrugsStat(from: Date, to: Date): Observable<Stat> {
    return this.getPeriodTests(from, to).pipe(
      map(tests => {

        const { totalTests, totalCompletedTests } = tests.reduce(
          (acc, test) => {
            acc.totalTests.push(test.tests);
            acc.totalCompletedTests.push(test.completed);
            return acc;
          },
          { totalTests: [] as number[], totalCompletedTests: [] as number[] }
        );

        return {
          startDate: from,
          endDate: substractDaysFromDate(to, 1),
          dataset: totalTests,
          dataset2: totalCompletedTests
        }
      })
    )
  }

  getDrugApprovalRatesStat(from: Date, to: Date): Observable<Stat> {
    return this.getPeriodTests(from, to).pipe(
      map(tests => {

        const { completedTests, approvedTests } = tests.reduce(
          (acc, test) => {
            acc.completedTests.push(test.completed);
            acc.approvedTests.push(test.approves);
            return acc;
          },
          { completedTests: [] as number[], approvedTests: [] as number[] }
        );
        
        return {
          startDate: from,
          endDate: substractDaysFromDate(to, 1),
          dataset: completedTests,
          dataset2: approvedTests
        }
      })
    )
  }

  getTestingProcessStat(from: Date, to: Date): Observable<Stat> {
    return this.getPeriodTests(from, to).pipe(
      map(tests => {
        const dataset = tests.reduce((acc, test) => {
          const { preclinicalTesting, clinicalTrials, regulatoryApproval } = test.testingProcess;
          return [acc[0] + preclinicalTesting, acc[1] + clinicalTrials, acc[2] + regulatoryApproval];
        }, 
        [0, 0, 0])

        return {
          startDate: from,
          endDate: substractDaysFromDate(to, 1),
          dataset: dataset
        }
      })
    )
  }

}
