import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DeathDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: DeathDeleteComponent;
  let fixture: ComponentFixture<DeathDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DeathDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DeathDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
