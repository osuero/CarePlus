import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ShiftManagement } from './shift-management.model';

@Injectable({
  providedIn: 'root',
})
export class ShiftManagementService {
  private readonly API_URL = 'assets/data/shift-management.json';
  dataChange: BehaviorSubject<ShiftManagement[]> = new BehaviorSubject<
    ShiftManagement[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all shift management data */
  getAllShiftDetails(): Observable<ShiftManagement[]> {
    return this.httpClient
      .get<ShiftManagement[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new shift management entry */
  addShiftManagement(
    shiftManagement: ShiftManagement
  ): Observable<ShiftManagement> {
    // Add the new shift management entry to the data array
    return of(shiftManagement).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to add the shift management entry
    // return this.httpClient.post<ShiftManagement>(this.API_URL, shiftManagement).pipe(
    //   map((response) => {
    //     return response; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing shift management entry */
  updateShiftManagement(
    shiftManagement: ShiftManagement
  ): Observable<ShiftManagement> {
    // Update the shift management entry in the data array
    return of(shiftManagement).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to update the shift management entry
    // return this.httpClient.put<ShiftManagement>(`${this.API_URL}`, shiftManagement).pipe(
    //   map((response) => {
    //     return response; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Delete a shift management entry by ID */
  deleteShiftManagement(id: string): Observable<string> {
    // Delete the shift management entry from the data array
    return of(id).pipe(
      map((response) => {
        return id;
      }),
      catchError(this.handleError)
    );

    // API call to delete the shift management entry
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map((response) => {
    //     return id; // return the ID of the deleted entry
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
