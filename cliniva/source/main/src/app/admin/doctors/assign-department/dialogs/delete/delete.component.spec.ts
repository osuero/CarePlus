import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AssignDepartmentDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: AssignDepartmentDeleteComponent;
  let fixture: ComponentFixture<AssignDepartmentDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AssignDepartmentDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AssignDepartmentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
