import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodStockComponent } from './blood-stock.component';

describe('BloodStockComponent', () => {
  let component: BloodStockComponent;
  let fixture: ComponentFixture<BloodStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloodStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloodStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
