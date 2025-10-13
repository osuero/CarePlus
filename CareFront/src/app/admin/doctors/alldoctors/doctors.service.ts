import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Doctors } from './doctors.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorsService {
  private readonly API_URL = 'assets/data/doctors.json';
  dataChange: BehaviorSubject<Doctors[]> = new BehaviorSubject<Doctors[]>([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all doctors */
  getAllDoctors(): Observable<Doctors[]> {
    return this.httpClient
      .get<Doctors[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new doctor */
  addDoctors(doctors: Doctors): Observable<Doctors> {
    // Add the new doctor to the data array
    return of(doctors).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to add the doctor
    // return this.httpClient.post<Doctors>(this.API_URL, doctors).pipe(
    //   map((response) => {
    //     return response; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing doctor */
  updateDoctors(doctors: Doctors): Observable<Doctors> {
    // Update the doctor in the data array
    return of(doctors).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to update the doctor
    // return this.httpClient.put<Doctors>(`${this.API_URL}`, doctors).pipe(
    //   map((response) => {
    //     return response; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove a doctor by ID */
  deleteDoctors(id: number): Observable<number> {
    // Update the doctor in the data array
    return of(id).pipe(
      map((response) => {
        return id;
      }),
      catchError(this.handleError)
    );

    // API call to delete the doctor
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map((response) => {
    //     return id; // return the ID of the deleted doctor
    //   }),
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
