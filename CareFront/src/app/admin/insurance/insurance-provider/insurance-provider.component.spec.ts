import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceProviderComponent } from './insurance-provider.component';

describe('InsuranceProviderComponent', () => {
  let component: InsuranceProviderComponent;
  let fixture: ComponentFixture<InsuranceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
