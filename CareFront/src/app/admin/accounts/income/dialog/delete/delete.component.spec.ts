import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IncomeDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: IncomeDeleteComponent;
  let fixture: ComponentFixture<IncomeDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IncomeDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
