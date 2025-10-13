import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AmbulanceCallListDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: AmbulanceCallListDeleteComponent;
  let fixture: ComponentFixture<AmbulanceCallListDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AmbulanceCallListDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AmbulanceCallListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
