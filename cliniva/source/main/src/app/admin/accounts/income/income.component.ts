import { Direction } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
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
import { IncomeDeleteComponent } from './dialog/delete/delete.component';
import { IncomeFormComponent } from './dialog/form-dialog/form-dialog.component';
import { Income } from './income.model';
import { IncomeService } from './income.service';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';

@Component({
  selector: 'app-income',
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
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss',
})
export class IncomeComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'incomeId', label: 'Income ID', type: 'text', visible: false },
    { def: 'patientId', label: 'Patient ID', type: 'text', visible: true },
    { def: 'patientName', label: 'Patient Name', type: 'text', visible: true },
    { def: 'serviceType', label: 'Service Type', type: 'text', visible: true },
    { def: 'serviceDate', label: 'Service Date', type: 'date', visible: true },
    {
      def: 'amountBilled',
      label: 'Amount Billed',
      type: 'number',
      visible: true,
    },
    { def: 'amountPaid', label: 'Amount Paid', type: 'number', visible: true },
    {
      def: 'paymentMethod',
      label: 'Payment Method',
      type: 'text',
      visible: true,
    },
    {
      def: 'insuranceAmount',
      label: 'Insurance Amount',
      type: 'number',
      visible: true,
    },
    {
      def: 'outstandingAmount',
      label: 'Outstanding Amount',
      type: 'number',
      visible: true,
    },
    { def: 'paymentDate', label: 'Payment Date', type: 'date', visible: true },
    {
      def: 'paymentStatus',
      label: 'Payment Status',
      type: 'text',
      visible: true,
    },
    { def: 'doctorId', label: 'Doctor ID', type: 'text', visible: false },
    { def: 'doctorFee', label: 'Doctor Fee', type: 'number', visible: false },
    { def: 'createdBy', label: 'Created By', type: 'text', visible: false },
    { def: 'createdAt', label: 'Created At', type: 'date', visible: false },
    { def: 'updatedBy', label: 'Updated By', type: 'text', visible: false },
    { def: 'updatedAt', label: 'Updated At', type: 'date', visible: false },
    { def: 'incomeType', label: 'Income Type', type: 'text', visible: true },
    { def: 'notes', label: 'Notes', type: 'text', visible: false },
    {
      def: 'invoiceNumber',
      label: 'Invoice Number',
      type: 'text',
      visible: true,
    },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Income>([]);
  selection = new SelectionModel<Income>(true, []);
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
    public incomeService: IncomeService,
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
    this.incomeService.getAllIncomeRecords().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: Income, filter: string) =>
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

  editCall(row: Income) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: Income) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(IncomeFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { income: data, action },
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

  private updateRecord(updatedRecord: Income) {
    const index = this.dataSource.data.findIndex(
      (record) => record.incomeId === updatedRecord.incomeId
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: Income) {
    const dialogRef = this.dialog.open(IncomeDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.incomeId !== row.incomeId
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
    const exportData = this.dataSource.filteredData.map((income) => ({
      'Income ID': income.incomeId,
      'Patient ID': income.patientId,
      'Patient Name': income.patientName,
      'Service Type': income.serviceType,
      'Service Date': income.serviceDate
        ? formatDate(income.serviceDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Amount Billed': income.amountBilled,
      'Amount Paid': income.amountPaid,
      'Payment Method': income.paymentMethod,
      'Insurance Amount': income.insuranceAmount,
      'Outstanding Amount': income.outstandingAmount,
      'Payment Date': income.paymentDate
        ? formatDate(income.paymentDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Payment Status': income.paymentStatus,
      'Doctor ID': income.doctorId,
      'Doctor Fee': income.doctorFee,
      'Created By': income.createdBy,
      'Created At': income.createdAt
        ? formatDate(income.createdAt, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Updated By': income.updatedBy,
      'Updated At': income.updatedAt
        ? formatDate(income.updatedAt, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Income Type': income.incomeType,
      Notes: income.notes,
      'Invoice Number': income.invoiceNumber,
    }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  onContextMenu(event: MouseEvent, item: Income) {
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
