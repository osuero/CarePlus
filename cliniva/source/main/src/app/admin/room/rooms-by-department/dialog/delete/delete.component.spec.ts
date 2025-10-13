import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RoomsByDepartmentDeleteComponent } from './delete.component';
describe('RoomsByDepartmentDeleteComponent', () => {
  let component: RoomsByDepartmentDeleteComponent;
  let fixture: ComponentFixture<RoomsByDepartmentDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RoomsByDepartmentDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsByDepartmentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
