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
import { PatientInsuranceDeleteComponent } from './dialogs/delete/delete.component';
import { AllPatientInsuranceFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { PatientInsurance } from './patient-insurance.model';
import { PatientInsuranceService } from './patient-insurance.service';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';

@Component({
  selector: 'app-patient-insurance',
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
  templateUrl: './patient-insurance.component.html',
  styleUrl: './patient-insurance.component.scss',
})
export class PatientInsuranceComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'insurance_id', label: 'Insurance ID', type: 'text', visible: true },
    { def: 'patient_id', label: 'Patient ID', type: 'text', visible: true },
    {
      def: 'insurance_company_name',
      label: 'Insurance Company Name',
      type: 'text',
      visible: true,
    },
    {
      def: 'insurance_policy_number',
      label: 'Insurance Policy Number',
      type: 'text',
      visible: true,
    },
    { def: 'policy_type', label: 'Policy Type', type: 'text', visible: true },
    {
      def: 'coverage_start_date',
      label: 'Coverage Start Date',
      type: 'date',
      visible: true,
    },
    {
      def: 'coverage_end_date',
      label: 'Coverage End Date',
      type: 'date',
      visible: true,
    },
    {
      def: 'coverage_amount',
      label: 'Coverage Amount',
      type: 'number',
      visible: true,
    },
    { def: 'co_payment', label: 'Co-payment', type: 'number', visible: true },
    {
      def: 'policy_holder_name',
      label: 'Policy Holder Name',
      type: 'text',
      visible: true,
    },
    { def: 'plan_type', label: 'Plan Type', type: 'text', visible: true },
    { def: 'benefits', label: 'Benefits', type: 'text', visible: false },
    {
      def: 'insurance_status',
      label: 'Insurance Status',
      type: 'text',
      visible: true,
    },
    {
      def: 'claim_limit',
      label: 'Claim Limit',
      type: 'number',
      visible: false,
    },
    { def: 'remarks', label: 'Remarks', type: 'text', visible: false },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<PatientInsurance>([]);
  selection = new SelectionModel<PatientInsurance>(true, []);
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
    public patientInsuranceService: PatientInsuranceService,
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
    this.patientInsuranceService.getAllPatientInsurance().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (
          data: PatientInsurance,
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

  editCall(row: PatientInsurance) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: PatientInsurance) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AllPatientInsuranceFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { patientInsurance: data, action },
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

  private updateRecord(updatedRecord: PatientInsurance) {
    const index = this.dataSource.data.findIndex(
      (record) => record.insurance_id === updatedRecord.insurance_id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: PatientInsurance) {
    const dialogRef = this.dialog.open(PatientInsuranceDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.insurance_id !== row.insurance_id
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
    const exportData = this.dataSource.filteredData.map((insurance) => ({
      'Insurance ID': insurance.insurance_id,
      'Patient ID': insurance.patient_id,
      'Insurance Company Name': insurance.insurance_company_name,
      'Insurance Policy Number': insurance.insurance_policy_number,
      'Policy Type': insurance.policy_type,
      'Coverage Start Date': insurance.coverage_start_date
        ? formatDate(insurance.coverage_start_date, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Coverage End Date': insurance.coverage_end_date
        ? formatDate(insurance.coverage_end_date, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Coverage Amount': insurance.coverage_amount,
      'Co-payment': insurance.co_payment,
      'Policy Holder Name': insurance.policy_holder_name,
      'Plan Type': insurance.plan_type,
      Benefits: insurance.benefits,
      'Insurance Status': insurance.insurance_status,
      'Claim Limit': insurance.claim_limit,
      Remarks: insurance.remarks,
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
  onContextMenu(event: MouseEvent, item: PatientInsurance) {
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
