import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AllHoliday } from './all-holidays.model';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private readonly API_URL = 'assets/data/holidays.json';
  private dataChange: BehaviorSubject<AllHoliday[]> = new BehaviorSubject<
    AllHoliday[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  get data(): AllHoliday[] {
    return this.dataChange.value;
  }

  /** GET: Fetch all holidays */
  getAllHolidays(): Observable<AllHoliday[]> {
    return this.httpClient.get<AllHoliday[]>(this.API_URL).pipe(
      map((holidays) => {
        this.dataChange.next(holidays);
        return holidays;
      }),
      catchError(this.handleError)
    );
  }

  /** POST: Add a new holiday */
  addHoliday(holiday: AllHoliday): Observable<AllHoliday> {
    // Add the new holiday to the data array
    return of(holiday).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to add the holiday
    // return this.httpClient.post<AllHoliday>(this.API_URL, holiday).pipe(
    //   map(() => {
    //     return holiday; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing holiday */
  updateHoliday(holiday: AllHoliday): Observable<AllHoliday> {
    // Update the holiday in the data array
    return of(holiday).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to update the holiday
    // return this.httpClient.put<AllHoliday>(`${this.API_URL}`, holiday).pipe(
    //   map(() => {
    //     return holiday; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove a holiday by ID */
  deleteHoliday(id: number): Observable<number> {
    // Delete the holiday from the data array
    return of(id).pipe(
      map((response) => {
        return id;
      }),
      catchError(this.handleError)
    );

    // API call to delete the holiday
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map(() => {
    //     return id; // return the ID of the deleted holiday
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
