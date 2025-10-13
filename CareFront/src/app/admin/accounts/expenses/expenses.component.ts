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
import { Expenses } from '../expenses/expenses.model';
import { ExpensesService } from '../expenses/expenses.service';
import { ExpensesDeleteComponent } from './dialog/delete/delete.component';
import { ExpensesFormComponent } from './dialog/form-dialog/form-dialog.component';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';

@Component({
  selector: 'app-expenses',
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
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'expense_id', label: 'Expenses ID', type: 'text', visible: false },
    { def: 'date', label: 'Date', type: 'date', visible: true },
    { def: 'category', label: 'Category', type: 'text', visible: true },
    { def: 'description', label: 'Description', type: 'text', visible: true },
    { def: 'amount', label: 'Amount', type: 'number', visible: true },
    { def: 'vendor', label: 'Vendor', type: 'text', visible: true },
    {
      def: 'invoice_number',
      label: 'Invoice Number',
      type: 'text',
      visible: true,
    },
    {
      def: 'payment_method',
      label: 'Payment Method',
      type: 'text',
      visible: true,
    },
    { def: 'department', label: 'Department', type: 'text', visible: true },
    { def: 'budget_code', label: 'Budget Code', type: 'text', visible: false },
    {
      def: 'employee_responsible',
      label: 'Employee Responsible',
      type: 'text',
      visible: false,
    },
    {
      def: 'approval_status',
      label: 'Approval Status',
      type: 'text',
      visible: true,
    },
    {
      def: 'payment_status',
      label: 'Payment Status',
      type: 'text',
      visible: true,
    },
    { def: 'notes', label: 'Notes', type: 'text', visible: false },
    { def: 'tax', label: 'Tax', type: 'number', visible: true },
    { def: 'total_cost', label: 'Total Cost', type: 'number', visible: true },
    { def: 'currency', label: 'Currency', type: 'text', visible: false },
    { def: 'created_by', label: 'Created By', type: 'text', visible: false },
    { def: 'created_at', label: 'Created At', type: 'date', visible: false },
    { def: 'updated_by', label: 'Updated By', type: 'text', visible: false },
    { def: 'updated_at', label: 'Updated At', type: 'date', visible: false },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Expenses>([]);
  selection = new SelectionModel<Expenses>(true, []);
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
    public expensesService: ExpensesService,
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
    this.expensesService.getAllExpensesRecords().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: Expenses, filter: string) =>
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

  editCall(row: Expenses) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: Expenses) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(ExpensesFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { expenses: data, action },
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

  private updateRecord(updatedRecord: Expenses) {
    const index = this.dataSource.data.findIndex(
      (record) => record.expense_id === updatedRecord.expense_id
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: Expenses) {
    const dialogRef = this.dialog.open(ExpensesDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.expense_id !== row.expense_id
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
    const exportData = this.dataSource.filteredData.map((expenses) => ({
      'Expenses ID': expenses.expense_id,
      Date: expenses.date
        ? formatDate(expenses.date, 'yyyy-MM-dd', 'en')
        : 'N/A',
      Category: expenses.category,
      Description: expenses.description,
      Amount: expenses.amount,
      Vendor: expenses.vendor,
      'Invoice Number': expenses.invoice_number,
      'Payment Method': expenses.payment_method,
      Department: expenses.department,
      'Budget Code': expenses.budget_code,
      'Employee Responsible': expenses.employee_responsible,
      'Approval Status': expenses.approval_status,
      'Payment Status': expenses.payment_status,
      Notes: expenses.notes,
      Tax: expenses.tax,
      'Total Cost': expenses.total_cost,
      Currency: expenses.currency,
      'Created By': expenses.created_by,
      'Created At': expenses.created_at
        ? formatDate(expenses.created_at, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Updated By': expenses.updated_by,
      'Updated At': expenses.updated_at
        ? formatDate(expenses.updated_at, 'yyyy-MM-dd', 'en')
        : 'N/A',
    }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  onContextMenu(event: MouseEvent, item: Expenses) {
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
