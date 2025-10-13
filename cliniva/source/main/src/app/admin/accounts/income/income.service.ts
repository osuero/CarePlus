import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Income } from './income.model';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private readonly API_URL = 'assets/data/income.json';
  dataChange: BehaviorSubject<Income[]> = new BehaviorSubject<Income[]>([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all income records */
  getAllIncomeRecords(): Observable<Income[]> {
    return this.httpClient
      .get<Income[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new income record */
  addIncomeRecord(income: Income): Observable<Income> {
    return of(income).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to add the income record
    // return this.httpClient.post<Income>(this.API_URL, income).pipe(
    //   map(() => income),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing income record */
  updateIncomeRecord(income: Income): Observable<Income> {
    return of(income).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to update the income record
    // return this.httpClient.put<Income>(`${this.API_URL}`, income).pipe(
    //   map(() => income),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove an income record by ID */
  deleteIncomeRecord(id: number): Observable<number> {
    return of(id).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to delete the income record
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map(() => id),
    //   catchError(this.handleError)
    // );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
