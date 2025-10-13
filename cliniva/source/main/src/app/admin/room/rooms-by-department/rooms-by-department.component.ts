import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass, DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { rowsAnimation, TableExportUtil } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Subject } from 'rxjs';
import { RoomsByDepartmentDeleteComponent } from './dialog/delete/delete.component';
import { RoomsByDepartmentFormComponent } from './dialog/form-dialog/form-dialog.component';
import { RoomsByDepartment } from './rooms-by-department.model';
import { RoomsByDepartmentService } from './rooms-by-department.service';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';

@Component({
  selector: 'app-rooms-by-department',
  animations: [rowsAnimation],
  imports: [
    BreadcrumbComponent,
    FeatherIconsComponent,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    DatePipe,
    TableShowHideColumnComponent,
  ],
  templateUrl: './rooms-by-department.component.html',
  styleUrl: './rooms-by-department.component.scss',
})
export class RoomsByDepartmentComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'room_id', label: 'Room ID', type: 'text', visible: false },
    { def: 'room_number', label: 'Room Number', type: 'text', visible: true },
    {
      def: 'department_name',
      label: 'Department',
      type: 'text',
      visible: true,
    },
    { def: 'room_type', label: 'Room Type', type: 'text', visible: true },
    { def: 'floor', label: 'Floor', type: 'number', visible: true },
    {
      def: 'bed_capacity',
      label: 'Bed Capacity',
      type: 'number',
      visible: true,
    },
    {
      def: 'occupied_beds',
      label: 'Occupied Beds',
      type: 'number',
      visible: true,
    },
    { def: 'room_status', label: 'Room Status', type: 'text', visible: true },
    {
      def: 'assigned_staff',
      label: 'Assigned Staff',
      type: 'text',
      visible: true,
    },
    { def: 'patient_id', label: 'Patient ID', type: 'text', visible: true },
    {
      def: 'room_features',
      label: 'Room Features',
      type: 'text',
      visible: true,
    },
    {
      def: 'admission_date',
      label: 'Admission Date',
      type: 'date',
      visible: false,
    },
    {
      def: 'discharge_date',
      label: 'Discharge Date',
      type: 'date',
      visible: false,
    },
    { def: 'room_rate', label: 'Room Rate', type: 'number', visible: true },
    {
      def: 'last_cleaned',
      label: 'Last Cleaned',
      type: 'date',
      visible: false,
    },
    {
      def: 'room_category',
      label: 'Room Category',
      type: 'text',
      visible: true,
    },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<RoomsByDepartment>([]);
  selection = new SelectionModel<RoomsByDepartment>(true, []);
  contextMenuPosition = { x: '0px', y: '0px' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public roomsByDepartmentService: RoomsByDepartmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.loadData();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  loadData() {
    this.roomsByDepartmentService.getAllRoomsByDepartment().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (
          data: RoomsByDepartment,
          filter: string
        ) =>
          Object.values(data).some((value) =>
            String(value).toLowerCase().includes(filter)
          );
      },
      error: (err) => console.error(err),
    });
  }

  private refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addNew() {
    this.openDialog('add');
  }

  editCall(row: RoomsByDepartment) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: RoomsByDepartment) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(RoomsByDepartmentFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { roomsByDepartment: data, action },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add') {
          this.dataSource.data = [result, ...this.dataSource.data];
        } else {
          this.updateRecord(result);
        }
        this.refreshTable();
        this.showNotification(
          action === 'add' ? 'snackbar-success' : 'black',
          `${action === 'add' ? 'Add' : 'Edit'} Record Successfully...!!!`,
          'bottom',
          'center'
        );
      }
    });
  }

  private updateRecord(updatedRecord: RoomsByDepartment) {
    const index = this.dataSource.data.findIndex(
      (record) => record.room_id === updatedRecord.room_id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: RoomsByDepartment) {
    const dialogRef = this.dialog.open(RoomsByDepartmentDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.room_id !== row.room_id
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-danger',
          'Delete Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter(
      (item) => !this.selection.selected.includes(item)
    );
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }
  exportExcel() {
    const exportData = this.dataSource.filteredData.map((room) => ({
      'Room ID': room.room_id,
      'Room Number': room.room_number,
      Department: room.department_name,
      'Room Type': room.room_type,
      Floor: room.floor,
      'Bed Capacity': room.bed_capacity,
      'Occupied Beds': room.occupied_beds,
      'Room Status': room.room_status,
      'Assigned Staff': room.assigned_staff,
      'Patient ID': room.patient_id ? room.patient_id : 'N/A',
      'Room Features': room.room_features,
      'Admission Date': room.admission_date
        ? formatDate(room.admission_date, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Discharge Date': room.discharge_date
        ? formatDate(room.discharge_date, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Room Rate': room.room_rate,
      'Last Cleaned': room.last_cleaned
        ? formatDate(room.last_cleaned, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Room Category': room.room_category,
    }));

    TableExportUtil.exportToExcel(exportData, 'department_data_export');
  }

  onContextMenu(event: MouseEvent, item: RoomsByDepartment) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`,
    };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
