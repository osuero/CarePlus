import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AllRoomDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: AllRoomDeleteComponent;
  let fixture: ComponentFixture<AllRoomDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AllRoomDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AllRoomDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
