import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AmbulanceListDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: AmbulanceListDeleteComponent;
  let fixture: ComponentFixture<AmbulanceListDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AmbulanceListDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AmbulanceListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
