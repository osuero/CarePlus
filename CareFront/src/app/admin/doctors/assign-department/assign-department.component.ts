import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { AssignDepartmentDeleteComponent } from './dialogs/delete/delete.component';
import { AssignDepartmentService } from './assign-department.service';
import { AssignDepartment } from './assign-department.model';
import { rowsAnimation, TableExportUtil } from '@shared';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Direction } from '@angular/cdk/bidi';
import { AssignDepartmentsFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';

@Component({
  selector: 'app-assign-department',
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
  templateUrl: './assign-department.component.html',
  styleUrl: './assign-department.component.scss',
})
export class AssignDepartmentComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'doctorName', label: 'Name', type: 'text', visible: true },
    { def: 'department', label: 'Department', type: 'text', visible: true },
    { def: 'specialty', label: 'Specialization', type: 'text', visible: true },
    {
      def: 'shiftSchedule',
      label: 'Shift Schedule',
      type: 'text',
      visible: true,
    },
    {
      def: 'experienceLevel',
      label: 'Experience Level',
      type: 'text',
      visible: true,
    },
    {
      def: 'currentAssignmentStatus',
      label: 'Assignment Status',
      type: 'text',
      visible: true,
    },
    {
      def: 'assignedDate',
      label: 'Assigned Date',
      type: 'date',
      visible: true,
    },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<AssignDepartment>([]);
  selection = new SelectionModel<AssignDepartment>(true, []);
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
    public assignDepartmentService: AssignDepartmentService,
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
    this.assignDepartmentService.getAllAssignedDoctors().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (
          data: AssignDepartment,
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

  editCall(row: AssignDepartment) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: AssignDepartment) {
    let varDirection: Direction =
      localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';

    const dialogRef = this.dialog.open(AssignDepartmentsFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { assignDepartment: data, action },
      direction: varDirection,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add') {
          this.assignDepartmentService.addAssignDepartment(result).subscribe({
            next: (newDoctor) => {
              this.dataSource.data = [newDoctor, ...this.dataSource.data];
              this.refreshTable();
              this.showNotification(
                'snackbar-success',
                'Added Record Successfully...!!!',
                'bottom',
                'center'
              );
            },
            error: (error) => console.error('Error adding doctor', error),
          });
        } else {
          this.assignDepartmentService.updateAssignedDoctor(result).subscribe({
            next: (updatedDoctor) => {
              this.updateRecord(updatedDoctor);
              this.refreshTable();
              this.showNotification(
                'black',
                'Edited Record Successfully...!!!',
                'bottom',
                'center'
              );
            },
            error: (error) => console.error('Error updating doctor', error),
          });
        }
      }
    });
  }

  private updateRecord(updatedRecord: AssignDepartment) {
    const index = this.dataSource.data.findIndex(
      (record) => record.doctorId === updatedRecord.doctorId
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: AssignDepartment) {
    const dialogRef = this.dialog.open(AssignDepartmentDeleteComponent, {
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.assignDepartmentService
          .deleteAssignDepartment(row.doctorId)
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
            error: (error) => console.error('Error deleting doctor', error),
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
      'Doctor ID': x.doctorId, // Mapping doctorId field
      'Doctor Name': x.doctorName, // Mapping doctorName field
      Department: x.department, // Mapping department field
      Specialty: x.specialty, // Mapping specialty field
      'Assigned Date':
        formatDate(new Date(x.assignedDate), 'yyyy-MM-dd', 'en') || '', // Formatting assignedDate field
      'Assignment Status': x.currentAssignmentStatus, // Mapping currentAssignmentStatus field
      'Shift Schedule': x.shiftSchedule, // Mapping shiftSchedule field
      'Experience Level': x.experienceLevel, // Mapping experienceLevel field
    }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((row) => {
      this.assignDepartmentService
        .deleteAssignDepartment(row.doctorId)
        .subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(
              (record) => record.doctorId !== row.doctorId
            );
            this.refreshTable();
          },
          error: (error) => console.error('Error removing doctor', error),
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

  onContextMenu(event: MouseEvent, item: AssignDepartment) {
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
