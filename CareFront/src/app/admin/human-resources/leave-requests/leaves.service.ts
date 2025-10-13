import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Leaves } from './leaves.model';

@Injectable({
  providedIn: 'root',
})
export class LeavesService {
  private readonly API_URL = 'assets/data/leaves.json';
  dataChange: BehaviorSubject<Leaves[]> = new BehaviorSubject<Leaves[]>([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all leaves */
  getAllLeaves(): Observable<Leaves[]> {
    return this.httpClient
      .get<Leaves[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new leave */
  addLeaves(leaves: Leaves): Observable<Leaves> {
    // Add the new leave to the data array
    return of(leaves).pipe(
      map((response) => {
        return response; // return the newly added leave
      }),
      catchError(this.handleError)
    );

    // API call to add the leave
    // return this.httpClient.post<Leaves>(this.API_URL, leaves).pipe(
    //   map(() => {
    //     return leaves; // return the newly added leave
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing leave */
  updateLeaves(leaves: Leaves): Observable<Leaves> {
    // Update the leave in the data array
    return of(leaves).pipe(
      map((response) => {
        return response; // return the updated leave
      }),
      catchError(this.handleError)
    );

    // API call to update the leave
    // return this.httpClient.put<Leaves>(`${this.API_URL}`, leaves).pipe(
    //   map(() => {
    //     return leaves; // return the updated leave
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove a leave by ID */
  deleteLeaves(id: number): Observable<number> {
    // Remove the leave by ID in the data array
    return of(id).pipe(
      map((response) => {
        return id; // return the ID of the deleted leave
      }),
      catchError(this.handleError)
    );

    // API call to delete the leave
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map(() => {
    //     return id; // return the ID of the deleted leave
    //   }),
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
