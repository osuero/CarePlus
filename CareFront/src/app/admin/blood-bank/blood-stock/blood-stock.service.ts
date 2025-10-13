import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BloodStock } from './blood-stock.model';

@Injectable({
  providedIn: 'root',
})
export class BloodStockService {
  private readonly API_URL = 'assets/data/blood-stock.json';
  dataChange: BehaviorSubject<BloodStock[]> = new BehaviorSubject<BloodStock[]>(
    []
  );

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all blood stock records */
  getAllBloodStocks(): Observable<BloodStock[]> {
    return this.httpClient
      .get<BloodStock[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new blood stock record */
  addBloodStock(bloodStock: BloodStock): Observable<BloodStock> {
    // Simulating local addition
    return of(bloodStock).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to add blood stock record
    // return this.httpClient.post<BloodStock>(this.API_URL, bloodStock).pipe(
    //   map((response) => response),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing blood stock record */
  updateBloodStock(bloodStock: BloodStock): Observable<BloodStock> {
    // Simulating local update
    return of(bloodStock).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to update blood stock record
    // return this.httpClient.put<BloodStock>(`${this.API_URL}`, bloodStock).pipe(
    //   map((response) => response),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove a blood stock record by ID */
  deleteBloodStock(id: number): Observable<number> {
    // Simulating local deletion
    return of(id).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to delete blood stock record
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map(() => id),
    //   catchError(this.handleError)
    // );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
