import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InsuranceProviderDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: InsuranceProviderDeleteComponent;
  let fixture: ComponentFixture<InsuranceProviderDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [InsuranceProviderDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceProviderDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
