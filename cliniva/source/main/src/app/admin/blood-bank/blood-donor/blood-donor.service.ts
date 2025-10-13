import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BloodDonor } from './blood-donor.model';

@Injectable({
  providedIn: 'root',
})
export class BloodDonorService {
  private readonly API_URL = 'assets/data/blood-donors.json';
  dataChange: BehaviorSubject<BloodDonor[]> = new BehaviorSubject<BloodDonor[]>(
    []
  );

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all blood donors */
  getAllBloodDonors(): Observable<BloodDonor[]> {
    return this.httpClient
      .get<BloodDonor[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new blood donor */
  addBloodDonor(bloodDonor: BloodDonor): Observable<BloodDonor> {
    // Simulating local addition
    return of(bloodDonor).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to add blood donor
    // return this.httpClient.post<BloodDonor>(this.API_URL, bloodDonor).pipe(
    //   map((response) => response),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing blood donor */
  updateBloodDonor(bloodDonor: BloodDonor): Observable<BloodDonor> {
    // Simulating local update
    return of(bloodDonor).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to update blood donor
    // return this.httpClient.put<BloodDonor>(`${this.API_URL}`, bloodDonor).pipe(
    //   map((response) => response),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove a blood donor by ID */
  deleteBloodDonor(id: number): Observable<number> {
    // Simulating local deletion
    return of(id).pipe(
      map((response) => response),
      catchError(this.handleError)
    );

    // API call to delete blood donor
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
