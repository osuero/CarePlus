import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewAppointmentDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: ViewAppointmentDeleteComponent;
  let fixture: ComponentFixture<ViewAppointmentDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ViewAppointmentDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppointmentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
