import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { IssuedItems } from './issued-items.model';

@Injectable({
  providedIn: 'root',
})
export class IssuedItemsService {
  private readonly API_URL = 'assets/data/issuedItems.json'; // Replace with actual API endpoint if needed
  dataChange: BehaviorSubject<IssuedItems[]> = new BehaviorSubject<
    IssuedItems[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all issued items */
  getAllIssuedItems(): Observable<IssuedItems[]> {
    // Simulate fetching data locally
    return this.httpClient
      .get<IssuedItems[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new issued item */
  addIssuedItems(issuedItems: IssuedItems): Observable<IssuedItems> {
    // Simulate adding issued item locally
    return of(issuedItems).pipe(
      map((response) => {
        return response; // Return the issued items object
      }),
      catchError(this.handleError)
    );

    // Uncomment for API call
    // return this.httpClient
    //   .post<IssuedItems>(this.API_URL, issuedItems)
    //   .pipe(
    //     map(() => {
    //       return issuedItems; // Return response from API
    //     }),
    //     catchError(this.handleError)
    //   );
  }

  /** PUT: Update an existing issued item */
  updateIssuedItems(issuedItems: IssuedItems): Observable<IssuedItems> {
    // Simulate updating issued item locally
    return of(issuedItems).pipe(
      map((response) => {
        return response; // Return the updated issued items object
      }),
      catchError(this.handleError)
    );

    // Uncomment for API call
    // return this.httpClient
    //   .put<IssuedItems>(`${this.API_URL}`, issuedItems)
    //   .pipe(
    //     map(() => {
    //       return issuedItems; // Return response from API
    //     }),
    //     catchError(this.handleError)
    //   );
  }

  /** DELETE: Remove an issued item by ID */
  deleteIssuedItems(id: number): Observable<number> {
    // Simulate deleting issued item locally
    return of(id).pipe(
      map(() => {
        return id; // Return the ID of the deleted issued item
      }),
      catchError(this.handleError)
    );

    // Uncomment for API call
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map(() => {
    //     return id; // Return the ID of the deleted issued item
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** Handle HTTP operation that failed */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
