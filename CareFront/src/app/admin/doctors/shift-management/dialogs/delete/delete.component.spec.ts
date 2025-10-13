import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ShiftManagementDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: ShiftManagementDeleteComponent;
  let fixture: ComponentFixture<ShiftManagementDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ShiftManagementDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftManagementDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
