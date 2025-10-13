import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DepartmentListDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: DepartmentListDeleteComponent;
  let fixture: ComponentFixture<DepartmentListDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DepartmentListDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
