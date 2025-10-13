import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PatientInsuranceDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: PatientInsuranceDeleteComponent;
  let fixture: ComponentFixture<PatientInsuranceDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PatientInsuranceDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(PatientInsuranceDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
