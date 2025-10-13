import { Route } from '@angular/router';
import { AllroomComponent } from './allroom/allroom.component';
import { AddAllotmentComponent } from './add-allotment/add-allotment.component';
import { EditAllotmentComponent } from './edit-allotment/edit-allotment.component';
import { Page404Component } from '../../authentication/page404/page404.component';
import { RoomsByDepartmentComponent } from './rooms-by-department/rooms-by-department.component';
import { AddRoomComponent } from './add-room/add-room.component';
export const ROOMS_ROUTE: Route[] = [
  {
    path: 'all-rooms',
    component: AllroomComponent,
  },
  {
    path: 'add-allotment',
    component: AddAllotmentComponent,
  },
  {
    path: 'edit-allotment',
    component: EditAllotmentComponent,
  },
  {
    path: 'rooms-by-department',
    component: RoomsByDepartmentComponent,
  },
  {
    path: 'add-room',
    component: AddRoomComponent,
  },

  { path: '**', component: Page404Component },
];
