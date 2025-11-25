import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BillingService } from '../../billing/billing.service';
import { AppointmentsService } from '../../appointments/appointments.service';
import { DoctorBillingComponent } from './billing.component';

class BillingServiceStub {
  searchBilling() {
    return of({
      nodes: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  }

  listInsuranceProviders() {
    return of([]);
  }
}

class AppointmentsServiceStub {
  getMetadata() {
    return of({ patients: [], doctors: [] });
  }
}

class MatDialogStub {
  open() {
    return { afterClosed: () => of(null) };
  }
}

describe('DoctorBillingComponent', () => {
  let component: DoctorBillingComponent;
  let fixture: ComponentFixture<DoctorBillingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DoctorBillingComponent],
        providers: [
          { provide: BillingService, useClass: BillingServiceStub },
           { provide: AppointmentsService, useClass: AppointmentsServiceStub },
          { provide: MatDialog, useClass: MatDialogStub },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
