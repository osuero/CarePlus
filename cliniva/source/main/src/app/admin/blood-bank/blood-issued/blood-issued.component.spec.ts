import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodIssuedComponent } from './blood-issued.component';

describe('BloodIssuedComponent', () => {
  let component: BloodIssuedComponent;
  let fixture: ComponentFixture<BloodIssuedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodIssuedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodIssuedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
