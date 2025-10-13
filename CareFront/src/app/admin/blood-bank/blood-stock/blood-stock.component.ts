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
import { BloodStock } from './blood-stock.model';
import { BloodStockService } from './blood-stock.service';
import { BloodStockFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { BloodStockDeleteComponent } from './dialogs/delete/delete.component';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';

@Component({
  selector: 'app-blood-stock',
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
  templateUrl: './blood-stock.component.html',
  styleUrl: './blood-stock.component.scss',
})
export class BloodStockComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    {
      def: 'bloodProductID',
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
      def: 'quantityInStock',
      label: 'Quantity In Stock',
      type: 'number',
      visible: true,
    },
    { def: 'expiryDate', label: 'Expiry Date', type: 'date', visible: true },
    {
      def: 'collectionDate',
      label: 'Collection Date',
      type: 'date',
      visible: true,
    },
    {
      def: 'storageLocation',
      label: 'Storage Location',
      type: 'text',
      visible: true,
    },
    {
      def: 'donationStatus',
      label: 'Donation Status',
      type: 'text',
      visible: true,
    },
    { def: 'batchNumber', label: 'Batch Number', type: 'text', visible: true },
    {
      def: 'conditionQualityStatus',
      label: 'Condition/Quality Status',
      type: 'text',
      visible: true,
    },
    {
      def: 'temperatureRange',
      label: 'Temperature Range',
      type: 'text',
      visible: true,
    },
    {
      def: 'dateLastUpdated',
      label: 'Date Last Updated',
      type: 'date',
      visible: true,
    },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<BloodStock>([]);
  selection = new SelectionModel<BloodStock>(true, []);
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
    public bloodStockService: BloodStockService,
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
    this.bloodStockService.getAllBloodStocks().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: BloodStock, filter: string) =>
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

  editCall(row: BloodStock) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: BloodStock) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(BloodStockFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { bloodStock: data, action },
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

  private updateRecord(updatedRecord: BloodStock) {
    const index = this.dataSource.data.findIndex(
      (record) => record.bloodProductID === updatedRecord.bloodProductID
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: BloodStock) {
    const dialogRef = this.dialog.open(BloodStockDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.bloodProductID !== row.bloodProductID
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
    const exportData = this.dataSource.filteredData.map((bloodStock) => ({
      'Blood Product ID': bloodStock.bloodProductID,
      'Blood Type': bloodStock.bloodType,
      'Component Type': bloodStock.componentType,
      'Quantity In Stock': bloodStock.quantityInStock,
      'Expiry Date': bloodStock.expiryDate
        ? formatDate(bloodStock.expiryDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Collection Date': bloodStock.collectionDate
        ? formatDate(bloodStock.collectionDate, 'yyyy-MM-dd', 'en')
        : 'N/A',
      'Storage Location': bloodStock.storageLocation,
      'Donation Status': bloodStock.donationStatus,
      'Batch Number': bloodStock.batchNumber,
      'Condition/Quality Status': bloodStock.conditionQualityStatus,
      'Temperature Range': bloodStock.temperatureRange,
      'Date Last Updated': bloodStock.dateLastUpdated
        ? formatDate(bloodStock.dateLastUpdated, 'yyyy-MM-dd', 'en')
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
  onContextMenu(event: MouseEvent, item: BloodStock) {
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
