import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { MedicineList } from './medicine-list.model';

@Injectable({
  providedIn: 'root',
})
export class MedicineListService {
  private readonly API_URL = 'assets/data/medicineList.json';
  dataChange: BehaviorSubject<MedicineList[]> = new BehaviorSubject<
    MedicineList[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  /** GET: Fetch all medicine lists */
  getAllMedicineLists(): Observable<MedicineList[]> {
    return this.httpClient
      .get<MedicineList[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new medicine list */
  addMedicineList(medicineList: MedicineList): Observable<MedicineList> {
    // Add the new medicine list to the data array
    return of(medicineList).pipe(
      map((response) => {
        return response; // return the added medicine list
      }),
      catchError(this.handleError)
    );

    // API call to add the medicine list
    // return this.httpClient
    //   .post<MedicineList>(this.API_URL, medicineList)
    //   .pipe(
    //     map((response) => {
    //       return response; // return the added medicine list from API
    //     }),
    //     catchError(this.handleError)
    //   );
  }

  /** PUT: Update an existing medicine list */
  updateMedicineList(medicineList: MedicineList): Observable<MedicineList> {
    // Update the medicine list in the data array
    return of(medicineList).pipe(
      map((response) => {
        return response; // return the updated medicine list
      }),
      catchError(this.handleError)
    );

    // API call to update the medicine list
    // return this.httpClient
    //   .put<MedicineList>(`${this.API_URL}`, medicineList)
    //   .pipe(
    //     map((response) => {
    //       return response; // return the updated medicine list from API
    //     }),
    //     catchError(this.handleError)
    //   );
  }

  /** DELETE: Remove a medicine list by ID */
  deleteMedicineList(id: number): Observable<number> {
    // Update the medicine list deletion in the data array
    return of(id).pipe(
      map((response) => {
        return id; // return the ID of the deleted medicine list
      }),
      catchError(this.handleError)
    );

    // API call to delete the medicine list
    // return this.httpClient.delete<void>(`${this.API_URL}`).pipe(
    //   map(() => {
    //     return id; // return the ID of the deleted medicine list
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
