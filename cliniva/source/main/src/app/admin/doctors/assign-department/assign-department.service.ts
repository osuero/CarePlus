import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AssignDepartment } from './assign-department.model';

@Injectable({
  providedIn: 'root',
})
export class AssignDepartmentService {
  private readonly API_URL = 'assets/data/assign-department.json';
  dataChange: BehaviorSubject<AssignDepartment[]> = new BehaviorSubject<
    AssignDepartment[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all assigned departments */
  getAllAssignedDoctors(): Observable<AssignDepartment[]> {
    return this.httpClient
      .get<AssignDepartment[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Assign a doctor to a task or department */
  addAssignDepartment(
    assignDepartment: AssignDepartment
  ): Observable<AssignDepartment> {
    // Add the new assignment to the data array
    return of(assignDepartment).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to add the assignment
    // return this.httpClient.post<AssignDepartment>(this.API_URL, assignDepartment).pipe(
    //   map((response) => {
    //     return response; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing doctor's assignment */
  updateAssignedDoctor(
    assignDepartment: AssignDepartment
  ): Observable<AssignDepartment> {
    // Update the assignment in the data array
    return of(assignDepartment).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to update the assignment
    // return this.httpClient.put<AssignDepartment>(`${this.API_URL}`, assignDepartment).pipe(
    //   map((response) => {
    //     return response; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Unassign a doctor by ID */
  deleteAssignDepartment(id: string): Observable<string> {
    // Delete the assignment from the data array
    return of(id).pipe(
      map((response) => {
        return id;
      }),
      catchError(this.handleError)
    );

    // API call to delete the assignment
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map((response) => {
    //     return id; // return the ID of the deleted assignment
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
