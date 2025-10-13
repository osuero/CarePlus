import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AllBloodStockDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: AllBloodStockDeleteComponent;
  let fixture: ComponentFixture<AllBloodStockDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AllBloodStockDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AllBloodStockDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
