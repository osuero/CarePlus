import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodDonorComponent } from './blood-donor.component';

describe('BloodDonorComponent', () => {
  let component: BloodDonorComponent;
  let fixture: ComponentFixture<BloodDonorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodDonorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodDonorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
