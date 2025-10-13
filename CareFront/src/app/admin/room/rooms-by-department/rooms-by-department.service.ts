import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { RoomsByDepartment } from './rooms-by-department.model'; // Import the RoomsByDepartment model

@Injectable({
  providedIn: 'root',
})
export class RoomsByDepartmentService {
  private readonly API_URL = 'assets/data/rooms-by-department.json'; // Update the URL for room data
  dataChange: BehaviorSubject<RoomsByDepartment[]> = new BehaviorSubject<
    RoomsByDepartment[]
  >([]); // Use RoomsByDepartment[] for the data

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all rooms by department */
  getAllRoomsByDepartment(): Observable<RoomsByDepartment[]> {
    return this.httpClient
      .get<RoomsByDepartment[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new room to the department list */
  addRoomToDepartment(
    roomsByDepartment: RoomsByDepartment
  ): Observable<RoomsByDepartment> {
    // Return the added room without API call
    return of(roomsByDepartment).pipe(
      map(() => {
        return roomsByDepartment; // Return the newly added room
      }),
      catchError(this.handleError)
    );

    // API call to add the room
    // return this.httpClient
    //   .post<RoomsByDepartment>(this.API_URL, roomsByDepartment)
    //   .pipe(
    //     map(() => {
    //       return roomsByDepartment; // Return the newly added room from API
    //     }),
    //     catchError(this.handleError)
    //   );
  }

  /** PUT: Update an existing room in the department list */
  updateRoomInDepartment(
    roomsByDepartment: RoomsByDepartment
  ): Observable<RoomsByDepartment> {
    // Update the room in the department list
    return of(roomsByDepartment).pipe(
      map(() => {
        return roomsByDepartment; // Return the updated room
      }),
      catchError(this.handleError)
    );

    // API call to update the room
    // return this.httpClient
    //   .put<RoomsByDepartment>(`${this.API_URL}`, roomsByDepartment)
    //   .pipe(
    //     map(() => {
    //       return roomsByDepartment; // Return the updated room from API
    //     }),
    //     catchError(this.handleError)
    //   );
  }

  /** DELETE: Remove a room by ID from the department */
  deleteRoomFromDepartment(id: number): Observable<number> {
    // Return the ID of the deleted room without API call
    return of(id).pipe(
      map(() => {
        return id; // Return the ID of the deleted room
      }),
      catchError(this.handleError)
    );

    // API call to delete the room
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map(() => {
    //     return id; // Return the ID of the deleted room from API
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
