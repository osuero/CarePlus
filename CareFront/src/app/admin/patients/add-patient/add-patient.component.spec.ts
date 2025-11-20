import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AddPatientComponent } from "./add-patient.component";

describe("AddPatientComponent", () => {
  let component: AddPatientComponent;
  let fixture: ComponentFixture<AddPatientComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
    imports: [AddPatientComponent, HttpClientTestingModule],
}).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
