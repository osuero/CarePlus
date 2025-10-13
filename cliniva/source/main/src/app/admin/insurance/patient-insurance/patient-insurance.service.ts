import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { PatientInsurance } from './patient-insurance.model';

@Injectable({
  providedIn: 'root',
})
export class PatientInsuranceService {
  private readonly API_URL = 'assets/data/patient-insurance.json'; // Replace with actual API endpoint if needed
  dataChange: BehaviorSubject<PatientInsurance[]> = new BehaviorSubject<
    PatientInsurance[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all patient insurance data */
  getAllPatientInsurance(): Observable<PatientInsurance[]> {
    return this.httpClient
      .get<PatientInsurance[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add new patient insurance */
  addPatientInsurance(
    patientInsurance: PatientInsurance
  ): Observable<PatientInsurance> {
    // Simulate adding the patient insurance locally
    return of(patientInsurance).pipe(
      map((response) => {
        return response; // Return the added patient insurance object
      }),
      catchError(this.handleError)
    );

    // Uncomment for API call
    // return this.httpClient
    //   .post<PatientInsurance>(this.API_URL, patientInsurance)
    //   .pipe(
    //     map((response) => {
    //       return patientInsurance; // Return the patient insurance object
    //     }),
    //     catchError(this.handleError)
    //   );
  }

  /** PUT: Update an existing patient insurance record */
  updatePatientInsurance(
    patientInsurance: PatientInsurance
  ): Observable<PatientInsurance> {
    // Simulate updating the patient insurance locally
    return of(patientInsurance).pipe(
      map((response) => {
        return response; // Return the updated patient insurance object
      }),
      catchError(this.handleError)
    );

    // Uncomment for API call
    // return this.httpClient
    //   .put<PatientInsurance>(`${this.API_URL}`, patientInsurance)
    //   .pipe(
    //     map((response) => {
    //       return patientInsurance; // Return the updated patient insurance object
    //     }),
    //     catchError(this.handleError)
    //   );
  }

  /** DELETE: Remove a patient insurance record by ID */
  deletePatientInsurance(id: string): Observable<string> {
    // Simulate deleting the patient insurance record locally
    return of(id).pipe(
      map(() => {
        return id; // Return the ID of the deleted insurance record
      }),
      catchError(this.handleError)
    );

    // Uncomment for API call
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map(() => {
    //     return id; // Return the ID of the deleted insurance record
    //   }),
    //   catchError(this.handleError)
    // );
  }

  /** Handle HTTP operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
