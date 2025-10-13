import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MedicineListDeleteComponent } from './delete.component';
describe('MedicineListDeleteComponent', () => {
  let component: MedicineListDeleteComponent;
  let fixture: ComponentFixture<MedicineListDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MedicineListDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
