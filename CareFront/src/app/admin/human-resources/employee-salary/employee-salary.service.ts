import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EmployeeSalary } from './employee-salary.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeSalaryService {
  private readonly API_URL = 'assets/data/employee-salary.json';

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all employee salaries */
  getAllEmployeeSalaries(): Observable<EmployeeSalary[]> {
    return this.httpClient
      .get<EmployeeSalary[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new employee salary */
  addEmployeeSalary(
    employeeSalary: EmployeeSalary
  ): Observable<EmployeeSalary> {
    // Add the new employee salary to the data array
    return of(employeeSalary).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to add the employee salary
    // return this.httpClient.post<EmployeeSalary>(this.API_URL, employeeSalary).pipe(
    //   map(() => {
    //     return employeeSalary; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** PUT: Update an existing employee salary */
  updateEmployeeSalary(
    employeeSalary: EmployeeSalary
  ): Observable<EmployeeSalary> {
    // Update the employee salary in the data array
    return of(employeeSalary).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );

    // API call to update the employee salary
    // return this.httpClient.put<EmployeeSalary>(`${this.API_URL}`, employeeSalary).pipe(
    //   map(() => {
    //     return employeeSalary; // return response from API
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** DELETE: Remove an employee salary by ID */
  deleteEmployeeSalary(id: number): Observable<number> {
    // Delete the employee salary from the data array
    return of(id).pipe(
      map((response) => {
        return id;
      }),
      catchError(this.handleError)
    );

    // API call to delete the employee salary
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map(() => {
    //     return id; // return the ID of the deleted employee salary
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
