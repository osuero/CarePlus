import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AllStaffDeleteDialogComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: AllStaffDeleteDialogComponent;
  let fixture: ComponentFixture<AllStaffDeleteDialogComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AllStaffDeleteDialogComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AllStaffDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
