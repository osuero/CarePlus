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
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { rowsAnimation, TableExportUtil } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Subject } from 'rxjs';
import { ShiftManagementDeleteComponent } from './dialogs/delete/delete.component';
import { ShiftManagement } from './shift-management.model';
import { ShiftManagementService } from './shift-management.service';
import { ShiftManagementFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';

@Component({
  selector: 'app-shift-management',
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
  templateUrl: './shift-management.component.html',
  styleUrl: './shift-management.component.scss',
})
export class ShiftManagementComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'doctorName', label: 'Name', type: 'text', visible: true },
    { def: 'department', label: 'Department', type: 'text', visible: true },
    { def: 'specialty', label: 'Specialization', type: 'text', visible: true },
    {
      def: 'shiftStartDate',
      label: 'Shift Start Date',
      type: 'date',
      visible: true,
    },
    {
      def: 'shiftEndDate',
      label: 'Shift End Date',
      type: 'date',
      visible: true,
    },
    { def: 'workDays', label: 'Work Days', type: 'text', visible: true },
    { def: 'shiftHours', label: 'Shift Hours', type: 'text', visible: true },
    { def: 'shiftType', label: 'Shift Type', type: 'text', visible: true },
    {
      def: 'availabilityStatus',
      label: 'Availability Status',
      type: 'text',
      visible: true,
    },
    {
      def: 'totalHoursPerWeek',
      label: 'Total Hours/Week',
      type: 'text',
      visible: false,
    },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<ShiftManagement>([]);
  selection = new SelectionModel<ShiftManagement>(true, []);
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
    public shiftManagementService: ShiftManagementService,
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
    this.shiftManagementService.getAllShiftDetails().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (
          data: ShiftManagement,
          filter: string
        ) =>
          Object.values(data).some((value) =>
            value.toString().toLowerCase().includes(filter)
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

  editCall(row: ShiftManagement) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: ShiftManagement) {
    let varDirection: Direction =
      localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';

    const dialogRef = this.dialog.open(ShiftManagementFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { shiftManagement: data, action },
      direction: varDirection,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add') {
          this.shiftManagementService.addShiftManagement(result).subscribe({
            next: (newShift) => {
              this.dataSource.data = [newShift, ...this.dataSource.data];
              this.refreshTable();
              this.showNotification(
                'snackbar-success',
                'Added Record Successfully...!!!',
                'bottom',
                'center'
              );
            },
            error: (error) =>
              console.error('Error adding shift management', error),
          });
        } else {
          this.shiftManagementService.updateShiftManagement(result).subscribe({
            next: (updatedShift) => {
              this.updateRecord(updatedShift);
              this.refreshTable();
              this.showNotification(
                'black',
                'Edited Record Successfully...!!!',
                'bottom',
                'center'
              );
            },
            error: (error) =>
              console.error('Error updating shift management', error),
          });
        }
      }
    });
  }

  private updateRecord(updatedRecord: ShiftManagement) {
    const index = this.dataSource.data.findIndex(
      (record) => record.doctorId === updatedRecord.doctorId
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: ShiftManagement) {
    const dialogRef = this.dialog.open(ShiftManagementDeleteComponent, {
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.shiftManagementService
          .deleteShiftManagement(row.doctorId)
          .subscribe({
            next: () => {
              this.dataSource.data = this.dataSource.data.filter(
                (record) => record.doctorId !== row.doctorId
              );
              this.refreshTable();
              this.showNotification(
                'snackbar-danger',
                'Deleted Record Successfully...!!!',
                'bottom',
                'center'
              );
            },
            error: (error) =>
              console.error('Error deleting shift management', error),
          });
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

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      'Doctor ID': x.doctorId,
      'Doctor Name': x.doctorName,
      Department: x.department,
      Specialty: x.specialty,
      'Shift Start Date': formatDate(
        new Date(x.shiftStartDate),
        'yyyy-MM-dd',
        'en'
      ),
      'Shift End Date': formatDate(
        new Date(x.shiftEndDate),
        'yyyy-MM-dd',
        'en'
      ),
      'Shift Type': x.shiftType,
      'Work Days': x.workDays,
      'Availability Status': x.availabilityStatus,
      'Total Hours/Week': x.totalHoursPerWeek,
    }));

    TableExportUtil.exportToExcel(exportData, 'shift-management');
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((row) => {
      this.shiftManagementService
        .deleteShiftManagement(row.doctorId)
        .subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(
              (record) => record.doctorId !== row.doctorId
            );
            this.refreshTable();
          },
          error: (error) =>
            console.error('Error removing shift management', error),
        });
    });
    this.selection.clear();
    this.showNotification(
      'snackbar-danger',
      `${totalSelect} Record(s) Deleted Successfully...!!!`,
      'bottom',
      'center'
    );
  }

  onContextMenu(event: MouseEvent, item: ShiftManagement) {
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
