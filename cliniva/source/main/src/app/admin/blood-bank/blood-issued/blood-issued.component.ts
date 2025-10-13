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
import { BloodIssuedDeleteComponent } from './dialogs/delete/delete.component';
import { BloodIssuedFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { BloodIssued } from './blood-issued.model';
import { BloodIssuedService } from './blood-issued.service';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';

@Component({
  selector: 'app-blood-issued',
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
  templateUrl: './blood-issued.component.html',
  styleUrl: './blood-issued.component.scss',
})
export class BloodIssuedComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'issueId', label: 'Issue ID', type: 'text', visible: true },
    { def: 'patientId', label: 'Patient ID', type: 'text', visible: true },
    { def: 'patientName', label: 'Patient Name', type: 'text', visible: true },
    { def: 'patientAge', label: 'Patient Age', type: 'number', visible: true },
    {
      def: 'patientGender',
      label: 'Patient Gender',
      type: 'text',
      visible: true,
    },
    {
      def: 'bloodProductId',
      label: 'Blood Product ID',
      type: 'text',
      visible: true,
    },
    { def: 'bloodType', label: 'Blood Type', type: 'text', visible: true },
    {
      def: 'componentType',
      label: 'Component Type',
      type: 'text',
      visible: true,
    },
    {
      def: 'quantityIssued',
      label: 'Quantity Issued',
      type: 'number',
      visible: true,
    },
    { def: 'issueDate', label: 'Issue Date', type: 'date', visible: true },
    { def: 'batchNumber', label: 'Batch Number', type: 'text', visible: false },
    { def: 'issuedBy', label: 'Issued By', type: 'text', visible: true },
    { def: 'issueReason', label: 'Issue Reason', type: 'text', visible: true },
    {
      def: 'patientBloodGroup',
      label: 'Patient Blood Group',
      type: 'text',
      visible: true,
    },
    { def: 'doctorId', label: 'Doctor ID', type: 'text', visible: false },
    { def: 'doctorName', label: 'Doctor Name', type: 'text', visible: true },
    {
      def: 'unitOfMeasure',
      label: 'Unit of Measure',
      type: 'text',
      visible: false,
    },
    { def: 'bloodStatus', label: 'Blood Status', type: 'text', visible: false },
    {
      def: 'bloodTransfusionDate',
      label: 'Blood Transfusion Date',
      type: 'date',
      visible: false,
    },
    { def: 'remarks', label: 'Remarks', type: 'text', visible: false },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<BloodIssued>([]);
  selection = new SelectionModel<BloodIssued>(true, []);
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
    public bloodIssuedService: BloodIssuedService,
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
    this.bloodIssuedService.getAllBloodIssued().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: BloodIssued, filter: string) =>
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

  editCall(row: BloodIssued) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: BloodIssued) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(BloodIssuedFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { bloodIssued: data, action },
      direction: varDirection,
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

  private updateRecord(updatedRecord: BloodIssued) {
    const index = this.dataSource.data.findIndex(
      (record) => record.issueId === updatedRecord.issueId
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: BloodIssued) {
    const dialogRef = this.dialog.open(BloodIssuedDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.issueId !== row.issueId
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

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((bloodIssued) => ({
      'Issue ID': bloodIssued.issueId,
      'Patient ID': bloodIssued.patientId,
      'Patient Name': bloodIssued.patientName,
      'Patient Age': bloodIssued.patientAge,
      'Patient Gender': bloodIssued.patientGender,
      'Blood Product ID': bloodIssued.bloodProductId,
      'Blood Type': bloodIssued.bloodType,
      'Component Type': bloodIssued.componentType,
      'Quantity Issued': bloodIssued.quantityIssued,
      'Issue Date': bloodIssued.issueDate
        ? formatDate(bloodIssued.issueDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Batch Number': bloodIssued.batchNumber,
      'Issued By': bloodIssued.issuedBy,
      'Issue Reason': bloodIssued.issueReason,
      'Patient Blood Group': bloodIssued.patientBloodGroup,
      'Doctor ID': bloodIssued.doctorId,
      'Doctor Name': bloodIssued.doctorName,
      'Unit of Measure': bloodIssued.unitOfMeasure,
      'Blood Status': bloodIssued.bloodStatus,
      'Blood Transfusion Date': bloodIssued.bloodTransfusionDate
        ? formatDate(bloodIssued.bloodTransfusionDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
      Remarks: bloodIssued.remarks,
    }));

    TableExportUtil.exportToExcel(exportData, 'excel');
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
  onContextMenu(event: MouseEvent, item: BloodIssued) {
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
