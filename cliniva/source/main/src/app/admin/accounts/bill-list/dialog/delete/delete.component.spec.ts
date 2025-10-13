import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BillListDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: BillListDeleteComponent;
  let fixture: ComponentFixture<BillListDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BillListDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(BillListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
