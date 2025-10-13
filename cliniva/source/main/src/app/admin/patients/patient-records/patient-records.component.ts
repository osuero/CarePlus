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
import { AllPatientDeleteComponent } from './dialog/delete/delete.component';
import { AllPatientFormDialogComponent } from './dialog/form-dialog/form-dialog.component';
import { PatientRecords } from './patient-records.model';
import { PatientRecordsService } from './patient-records.service';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';

@Component({
  selector: 'app-patientRecords-records',
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
  templateUrl: './patient-records.component.html',
  styleUrl: './patient-records.component.scss',
})
export class PatientRecordsComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'patientId', label: 'Patient ID', type: 'text', visible: true },
    { def: 'fullName', label: 'Full Name', type: 'text', visible: true },
    {
      def: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      visible: false,
    },
    { def: 'gender', label: 'Gender', type: 'text', visible: true },
    {
      def: 'dateOfAdmission',
      label: 'Date of Admission',
      type: 'date',
      visible: true,
    },
    { def: 'diagnosis', label: 'Diagnosis', type: 'text', visible: true },
    { def: 'labReports', label: 'Lab Reports', type: 'file', visible: true },
    {
      def: 'treatmentPlan',
      label: 'Treatment Plan',
      type: 'text',
      visible: false,
    },
    { def: 'medications', label: 'Medications', type: 'file', visible: true },
    {
      def: 'medicationHistory',
      label: 'Medication History',
      type: 'file',
      visible: false,
    },
    {
      def: 'nextFollowUp',
      label: 'Next Follow-Up',
      type: 'date',
      visible: true,
    },
    {
      def: 'doctorsNotes',
      label: "Doctor's Notes",
      type: 'text',
      visible: false,
    },
    { def: 'status', label: 'Status', type: 'text', visible: true },
    {
      def: 'emergencyContact',
      label: 'Emergency Contact',
      type: 'phone',
      visible: false,
    },
    {
      def: 'insuranceProvider',
      label: 'Insurance Provider',
      type: 'text',
      visible: false,
    },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<PatientRecords>([]);
  selection = new SelectionModel<PatientRecords>(true, []);
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
    public patientRecordsService: PatientRecordsService,
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
    this.patientRecordsService.getAllPatientRecords().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (
          data: PatientRecords,
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

  editCall(row: PatientRecords) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: PatientRecords) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AllPatientFormDialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { patientRecords: data, action },
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

  private updateRecord(updatedRecord: PatientRecords) {
    const index = this.dataSource.data.findIndex(
      (record) => record.patientId === updatedRecord.patientId
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: PatientRecords) {
    const dialogRef = this.dialog.open(AllPatientDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.patientId !== row.patientId
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
    const exportData = this.dataSource.filteredData.map((x) => ({
      'Patient ID': x.patientId,
      'Full Name': x.fullName,
      'Date of Birth': x.dateOfBirth,
      Gender: x.gender,
      'Date of Admission': x.dateOfAdmission,
      Diagnosis: x.diagnosis,
      'Lab Reports': x.labReports,
      'Treatment Plan': x.treatmentPlan,
      Medications: x.medications,
      'Medication History': x.medicationHistory,
      'Next Follow-Up': x.nextFollowUp,
      "Doctor's Notes": x.doctorsNotes,
      Status: x.status,
      'Emergency Contact': x.emergencyContact,
      'Insurance Provider': x.insuranceProvider,
    }));

    TableExportUtil.exportToExcel(exportData, 'patient_management_export');
  }

  onContextMenu(event: MouseEvent, item: PatientRecords) {
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
