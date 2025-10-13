import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Room } from './room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly API_URL = 'assets/data/rooms.json';
  dataChange: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all rooms */
  getAllRooms(): Observable<Room[]> {
    return this.httpClient
      .get<Room[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new room */
  addRoom(room: Room): Observable<Room> {
    // Add the new room to the data array
    return of(room).pipe(
      map(() => {
        return room; // Return the added room
      }),
      catchError(this.handleError)
    );

    // API call to add the room
    // return this.httpClient.post<Room>(this.API_URL, room).pipe(
    //   map(() => {
    //     return room; // Return the added room from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing room */
  updateRoom(room: Room): Observable<Room> {
    // Update the room in the data array
    return of(room).pipe(
      map(() => {
        return room; // Return the updated room
      }),
      catchError(this.handleError)
    );

    // API call to update the room
    // return this.httpClient.put<Room>(`${this.API_URL}`, room).pipe(
    //   map(() => {
    //     return room; // Return the updated room from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove a room by ID */
  deleteRoom(id: number): Observable<number> {
    // Remove the room from the data array
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
