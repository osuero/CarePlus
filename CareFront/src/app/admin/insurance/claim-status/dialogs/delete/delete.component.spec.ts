import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClaimStatusDeleteComponent } from './delete.component';
describe('DeleteComponent', () => {
  let component: ClaimStatusDeleteComponent;
  let fixture: ComponentFixture<ClaimStatusDeleteComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ClaimStatusDeleteComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimStatusDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
