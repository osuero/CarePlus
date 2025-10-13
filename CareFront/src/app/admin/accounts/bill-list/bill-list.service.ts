import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BillList } from './bill-list.model';

@Injectable({
  providedIn: 'root',
})
export class BillListService {
  private readonly API_URL = 'assets/data/billList.json';
  dataChange: BehaviorSubject<BillList[]> = new BehaviorSubject<BillList[]>([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all bill lists */
  getAllBillLists(): Observable<BillList[]> {
    return this.httpClient
      .get<BillList[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new bill list */
  addBillList(billList: BillList): Observable<BillList> {
    // Add the new bill list to the data array
    return of(billList).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to add the bill list
    // return this.httpClient.post<BillList>(this.API_URL, billList).pipe(
    //   map((response) => {
    //     return response; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing bill list */
  updateBillList(billList: BillList): Observable<BillList> {
    // Update the bill list in the data array
    return of(billList).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to update the bill list
    // return this.httpClient.put<BillList>(`${this.API_URL}`, billList).pipe(
    //   map((response) => {
    //     return response; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove a bill list by ID */
  deleteBillList(id: number): Observable<number> {
    // Update the bill list in the data array
    return of(id).pipe(
      map((response) => {
        return id;
      }),
      catchError(this.handleError)
    );

    // API call to delete the bill list
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map((response) => {
    //     return id; // return the ID of the deleted bill list
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
