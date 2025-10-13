import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BirthDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: BirthDeleteComponent;
  let fixture: ComponentFixture<BirthDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BirthDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(BirthDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
