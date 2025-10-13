import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AllBloodDonorDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: AllBloodDonorDeleteComponent;
  let fixture: ComponentFixture<AllBloodDonorDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AllBloodDonorDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AllBloodDonorDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
