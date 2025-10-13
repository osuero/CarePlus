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
import { InsuranceProviderDeleteComponent } from './dialogs/delete/delete.component';
import { AllInsuranceProviderFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { InsuranceProvider } from './insurance-provider.model';
import { InsuranceProviderService } from './insurance-provider.service';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';

@Component({
  selector: 'app-insurance-provider',
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
    CommonModule,
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
  templateUrl: './insurance-provider.component.html',
  styleUrl: './insurance-provider.component.scss',
})
export class InsuranceProviderComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    {
      def: 'insuranceProviderId',
      label: 'Provider ID',
      type: 'number',
      visible: false,
    },
    {
      def: 'providerName',
      label: 'Provider Name',
      type: 'text',
      visible: true,
    },
    {
      def: 'providerCode',
      label: 'Provider Code',
      type: 'text',
      visible: true,
    },
    {
      def: 'contactPhone',
      label: 'Contact Phone',
      type: 'phone',
      visible: true,
    },
    {
      def: 'contactEmail',
      label: 'Contact Email',
      type: 'email',
      visible: true,
    },
    { def: 'address', label: 'Address', type: 'address', visible: true },
    { def: 'websiteUrl', label: 'Website URL', type: 'url', visible: true },
    {
      def: 'customerSupportNumber',
      label: 'Customer Support Number',
      type: 'phone',
      visible: true,
    },
    {
      def: 'paymentTerms',
      label: 'Payment Terms',
      type: 'text',
      visible: false,
    },
    {
      def: 'contractStartDate',
      label: 'Contract Start Date',
      type: 'date',
      visible: true,
    },
    {
      def: 'contractEndDate',
      label: 'Contract End Date',
      type: 'date',
      visible: false,
    },
    {
      def: 'reimbursementRate',
      label: 'Reimbursement Rate',
      type: 'number',
      visible: true,
    },
    {
      def: 'coverageTypes',
      label: 'Coverage Types',
      type: 'text',
      visible: true,
    },
    { def: 'status', label: 'Status', type: 'text', visible: true },
    {
      def: 'contractNotes',
      label: 'Contract Notes',
      type: 'text',
      visible: false,
    },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<InsuranceProvider>([]);
  selection = new SelectionModel<InsuranceProvider>(true, []);
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
    public insuranceProviderService: InsuranceProviderService,
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
    this.insuranceProviderService.getAllInsuranceProviders().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (
          data: InsuranceProvider,
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

  editCall(row: InsuranceProvider) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: InsuranceProvider) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AllInsuranceProviderFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { insuranceProvider: data, action },
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

  private updateRecord(updatedRecord: InsuranceProvider) {
    const index = this.dataSource.data.findIndex(
      (record) =>
        record.insuranceProviderId === updatedRecord.insuranceProviderId
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: InsuranceProvider) {
    const dialogRef = this.dialog.open(InsuranceProviderDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.insuranceProviderId !== row.insuranceProviderId
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
    const exportData = this.dataSource.filteredData.map((provider) => ({
      'Provider ID': provider.insuranceProviderId,
      'Provider Name': provider.providerName,
      'Provider Code': provider.providerCode,
      'Contact Phone': provider.contactPhone,
      'Contact Email': provider.contactEmail,
      Address: provider.address,
      'Website URL': provider.websiteUrl,
      'Customer Support Number': provider.customerSupportNumber,
      'Payment Terms': provider.paymentTerms,
      'Contract Start Date': provider.contractStartDate
        ? formatDate(provider.contractStartDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Contract End Date': provider.contractEndDate
        ? formatDate(provider.contractEndDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Reimbursement Rate': provider.reimbursementRate,
      'Coverage Types': provider.coverageTypes,
      Status: provider.status,
      'Contract Notes': provider.contractNotes,
      'Claim Date': provider.claimDate
        ? formatDate(provider.claimDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
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
  onContextMenu(event: MouseEvent, item: InsuranceProvider) {
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
