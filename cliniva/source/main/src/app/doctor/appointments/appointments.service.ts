import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Appointments } from './appointments.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private readonly API_URL = 'assets/data/doc-appointments.json';
  private isTblLoading = true;
  private dataChange: BehaviorSubject<Appointments[]> = new BehaviorSubject<
    Appointments[]
  >([]);
  private dialogData!: Appointments;

  constructor(private httpClient: HttpClient) {}

  get data(): Appointments[] {
    return this.dataChange.value;
  }

  getDialogData(): Appointments {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllAppointments(): Observable<Appointments[]> {
    this.isTblLoading = true;
    return this.httpClient
      .get<Appointments[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  addAppointments(appointments: Appointments): Observable<Appointments> {
    // Simulate adding the new appointment
    return of(appointments).pipe(
      map((response) => {
        return response; // return the added appointment
      }),
      catchError(this.handleError)
    );

    // Uncomment the following to make an actual API call
    // return this.httpClient
    //   .post<Appointments>(this.API_URL, appointments)
    //   .pipe(catchError(this.handleError));
  }

  updateAppointments(appointments: Appointments): Observable<Appointments> {
    // Simulate updating the appointment
    return of(appointments).pipe(
      map((response) => {
        return response; // return the updated appointment
      }),
      catchError(this.handleError)
    );

    // Uncomment the following to make an actual API call
    // return this.httpClient
    //   .put<Appointments>(`${this.API_URL}`, appointments)
    //   .pipe(catchError(this.handleError));
  }

  deleteAppointments(id: number): Observable<void> {
    // Simulate deleting the appointment
    return of(void 0).pipe(
      map(() => {
        return;
      }),
      catchError(this.handleError)
    );

    // Uncomment the following to make an actual API call
    // return this.httpClient
    //   .delete<void>(`${this.API_URL}`)
    //   .pipe(catchError(this.handleError));
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
