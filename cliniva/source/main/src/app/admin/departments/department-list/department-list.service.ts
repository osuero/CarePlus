import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { DepartmentList } from './department-list.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentListService {
  private readonly API_URL = 'assets/data/departmentList.json';
  dataChange: BehaviorSubject<DepartmentList[]> = new BehaviorSubject<
    DepartmentList[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all department lists */
  getAllDepartmentLists(): Observable<DepartmentList[]> {
    return this.httpClient
      .get<DepartmentList[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new department list */
  addDepartmentList(
    departmentList: DepartmentList
  ): Observable<DepartmentList> {
    // Add the new department to the data array
    return of(departmentList).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to add the department
    // return this.httpClient.post<DepartmentList>(this.API_URL, departmentList).pipe(
    //   map((response) => {
    //     return response; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing department list */
  updateDepartmentList(
    departmentList: DepartmentList
  ): Observable<DepartmentList> {
    // Update the department in the data array
    return of(departmentList).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to update the department
    // return this.httpClient.put<DepartmentList>(`${this.API_URL}`, departmentList).pipe(
    //   map((response) => {
    //     return response; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove a department list by ID */
  deleteDepartmentList(id: number): Observable<number> {
    // Delete the department from the data array
    return of(id).pipe(
      map((response) => {
        return id;
      }),
      catchError(this.handleError)
    );

    // API call to delete the department
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map((response) => {
    //     return id; // return the ID of the deleted department
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
