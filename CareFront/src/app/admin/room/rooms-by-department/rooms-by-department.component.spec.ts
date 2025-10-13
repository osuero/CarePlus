import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsByDepartmentComponent } from './rooms-by-department.component';

describe('RoomsByDepartmentComponent', () => {
  let component: RoomsByDepartmentComponent;
  let fixture: ComponentFixture<RoomsByDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsByDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsByDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
