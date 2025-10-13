import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BloodIssued } from './blood-issued.model';

@Injectable({
  providedIn: 'root',
})
export class BloodIssuedService {
  private readonly API_URL = 'assets/data/blood-issued.json';
  dataChange: BehaviorSubject<BloodIssued[]> = new BehaviorSubject<
    BloodIssued[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all blood issued records */
  getAllBloodIssued(): Observable<BloodIssued[]> {
    return this.httpClient
      .get<BloodIssued[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new blood issued record */
  addBloodIssued(bloodIssued: BloodIssued): Observable<BloodIssued> {
    // Simulating local addition
    return of(bloodIssued).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to add blood issued record
    // return this.httpClient.post<BloodIssued>(this.API_URL, bloodIssued).pipe(
    //   map((response) => response),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing blood issued record */
  updateBloodIssued(bloodIssued: BloodIssued): Observable<BloodIssued> {
    // Simulating local update
    return of(bloodIssued).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to update blood issued record
    // return this.httpClient.put<BloodIssued>(`${this.API_URL}`, bloodIssued).pipe(
    //   map((response) => response),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove a blood issued record by ID */
  deleteBloodIssued(id: number): Observable<number> {
    // Simulating local deletion
    return of(id).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to delete blood issued record
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
