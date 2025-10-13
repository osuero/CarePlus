import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Staff } from './staff.model';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private readonly API_URL = 'assets/data/staff.json';
  dataChange: BehaviorSubject<Staff[]> = new BehaviorSubject<Staff[]>([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all staff members */
  getAllStaffs(): Observable<Staff[]> {
    return this.httpClient
      .get<Staff[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new staff member */
  addStaff(staff: Staff): Observable<Staff> {
    // Return the added staff without API call
    return of(staff).pipe(
      map(() => {
        return staff; // Return the added staff
      }),
      catchError(this.handleError)
    );

    // API call to add staff
    // return this.httpClient.post<Staff>(this.API_URL, staff).pipe(
    //   map((response) => {
    //     return staff; // Return the added staff from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing staff member */
  updateStaff(staff: Staff): Observable<Staff> {
    // Update the staff without API call
    return of(staff).pipe(
      map(() => {
        return staff; // Return the updated staff
      }),
      catchError(this.handleError)
    );

    // API call to update staff
    // return this.httpClient.put<Staff>(`${this.API_URL}`, staff).pipe(
    //   map(() => {
    //     return staff; // Return the updated staff from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove a staff member by ID */
  deleteStaff(id: number): Observable<number> {
    // Return the ID of the deleted staff without API call
    return of(id).pipe(
      map(() => {
        return id; // Return the ID of the deleted staff
      }),
      catchError(this.handleError)
    );

    // API call to delete staff
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map(() => {
    //     return id; // Return the ID of the deleted staff from API
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
