import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AllBloodIssuedDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: AllBloodIssuedDeleteComponent;
  let fixture: ComponentFixture<AllBloodIssuedDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AllBloodIssuedDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AllBloodIssuedDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
