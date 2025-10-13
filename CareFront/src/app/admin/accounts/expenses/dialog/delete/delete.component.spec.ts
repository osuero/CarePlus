import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ExpensesDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: ExpensesDeleteComponent;
  let fixture: ComponentFixture<ExpensesDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ExpensesDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
