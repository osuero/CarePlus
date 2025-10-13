import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllPatientDeleteComponent } from './delete.component';

describe('AllPatientDeleteComponent', () => {
  let component: AllPatientDeleteComponent;
  let fixture: ComponentFixture<AllPatientDeleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AllPatientDeleteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPatientDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
