import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { TodaysAttendance } from './todays-attendance..model';

@Injectable({
  providedIn: 'root',
})
export class TodaysAttendanceService {
  private readonly API_URL = 'assets/data/todays-attendance.json';
  private dataChange: BehaviorSubject<TodaysAttendance[]> = new BehaviorSubject<
    TodaysAttendance[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  get data(): TodaysAttendance[] {
    return this.dataChange.value;
  }

  /** GET: Fetch all today's attendance data */
  getAllTodays(): Observable<TodaysAttendance[]> {
    return this.httpClient.get<TodaysAttendance[]>(this.API_URL).pipe(
      map((todays) => {
        this.dataChange.next(todays); // Update the data change observable
        return todays;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add new today's attendance data */
  addToday(todaysAttendance: TodaysAttendance): Observable<TodaysAttendance> {
    // Simulate adding the attendance data locally
    return of(todaysAttendance).pipe(
      map((response) => {
        return response; // Return the newly added attendance data
      }),
      catchError(this.handleError)
    );

    // API call to add attendance data
    // return this.httpClient.post<TodaysAttendance>(this.API_URL, todaysAttendance).pipe(
    //   map(() => {
    //     return todaysAttendance; // Return the newly added attendance data
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update existing today's attendance data */
  updateToday(
    todaysAttendance: TodaysAttendance
  ): Observable<TodaysAttendance> {
    // Simulate updating the attendance data locally
    return of(todaysAttendance).pipe(
      map((response) => {
        return response; // Return the updated attendance data
      }),
      catchError(this.handleError)
    );

    // API call to update attendance data
    // return this.httpClient.put<TodaysAttendance>(`${this.API_URL}`, todaysAttendance).pipe(
    //   map(() => {
    //     return todaysAttendance; // Return the updated attendance data
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove today's attendance data by ID */
  deleteToday(id: number): Observable<number> {
    // Simulate deleting the attendance data locally
    return of(id).pipe(
      map(() => {
        return id; // Return the ID of the deleted attendance data
      }),
      catchError(this.handleError)
    );

    // API call to delete attendance data
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map(() => {
    //     return id; // Return the ID of the deleted attendance data
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
