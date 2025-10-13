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
import { BloodDonorDeleteComponent } from './dialogs/delete/delete.component';
import { BloodDonorFormComponent } from './dialogs/form-dialog/form-dialog.component';
import { BloodDonor } from './blood-donor.model';
import { BloodDonorService } from './blood-donor.service';
import { TableShowHideColumnComponent } from '@shared/components/table-show-hide-column/table-show-hide-column.component';

@Component({
  selector: 'app-blood-donor',
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
  templateUrl: './blood-donor.component.html',
  styleUrl: './blood-donor.component.scss',
})
export class BloodDonorComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'select', label: 'Checkbox', type: 'check', visible: true },
    { def: 'donorId', label: 'Donor ID', type: 'text', visible: true },
    { def: 'donorName', label: 'Donor Name', type: 'text', visible: true },
    { def: 'dateOfBirth', label: 'Date of Birth', type: 'date', visible: true },
    { def: 'gender', label: 'Gender', type: 'text', visible: true },
    { def: 'bloodType', label: 'Blood Type', type: 'text', visible: true },
    { def: 'address', label: 'Address', type: 'address', visible: false },
    { def: 'phoneNumber', label: 'Phone Number', type: 'phone', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'donorStatus', label: 'Donor Status', type: 'text', visible: true },
    {
      def: 'lastDonationDate',
      label: 'Last Donation Date',
      type: 'date',
      visible: true,
    },
    {
      def: 'nextEligibleDonationDate',
      label: 'Next Eligible Donation Date',
      type: 'date',
      visible: true,
    },
    {
      def: 'donationFrequency',
      label: 'Donation Frequency',
      type: 'text',
      visible: false,
    },
    {
      def: 'healthStatus',
      label: 'Health Status',
      type: 'text',
      visible: false,
    },
    {
      def: 'donationHistory',
      label: 'Donation History',
      type: 'number',
      visible: false,
    },
    {
      def: 'donorCategory',
      label: 'Donor Category',
      type: 'text',
      visible: false,
    },
    {
      def: 'donorIdentificationNumber',
      label: 'Donor Identification Number',
      type: 'text',
      visible: false,
    },
    {
      def: 'medicalHistory',
      label: 'Medical History',
      type: 'text',
      visible: false,
    },
    {
      def: 'emergencyContactPhone',
      label: 'Emergency Contact Phone',
      type: 'text',
      visible: false,
    },
    {
      def: 'registrationDate',
      label: 'Registration Date',
      type: 'date',
      visible: false,
    },
    {
      def: 'donorLocation',
      label: 'Donor Location',
      type: 'text',
      visible: true,
    },
    { def: 'donorNotes', label: 'Donor Notes', type: 'text', visible: false },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<BloodDonor>([]);
  selection = new SelectionModel<BloodDonor>(true, []);
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
    public bloodDonorService: BloodDonorService,
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
    this.bloodDonorService.getAllBloodDonors().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data: BloodDonor, filter: string) =>
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

  editCall(row: BloodDonor) {
    this.openDialog('edit', row);
  }

  openDialog(action: 'add' | 'edit', data?: BloodDonor) {
    let varDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      varDirection = 'rtl';
    } else {
      varDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(BloodDonorFormComponent, {
      width: '60vw',
      maxWidth: '100vw',
      data: { bloodDonor: data, action },
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

  private updateRecord(updatedRecord: BloodDonor) {
    const index = this.dataSource.data.findIndex(
      (record) => record.donorId === updatedRecord.donorId
    );
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItem(row: BloodDonor) {
    const dialogRef = this.dialog.open(BloodDonorDeleteComponent, {
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.donorId !== row.donorId
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
    const exportData = this.dataSource.filteredData.map((donor) => ({
      'Donor ID': donor.donorId,
      'Donor Name': donor.donorName,
      'Date of Birth': donor.dateOfBirth,
      Gender: donor.gender,
      'Blood Type': donor.bloodType,
      Address: donor.address,
      'Phone Number': donor.phoneNumber,
      Email: donor.email,
      'Donor Status': donor.donorStatus,
      'Last Donation Date': donor.lastDonationDate,
      'Next Eligible Donation Date': donor.nextEligibleDonationDate,
      'Donation Frequency': donor.donationFrequency,
      'Health Status': donor.healthStatus,
      'Donation History': donor.donationHistory,
      'Donor Category': donor.donorCategory,
      'Donor Identification Number': donor.donorIdentificationNumber,
      'Medical History': donor.medicalHistory,
      'Emergency Contact Phone': donor.emergencyContactPhone,
      'Registration Date': donor.registrationDate,
      'Donor Location': donor.donorLocation,
      'Donor Notes': donor.donorNotes,
    }));

    TableExportUtil.exportToExcel(exportData, 'Donor Data');
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
  onContextMenu(event: MouseEvent, item: BloodDonor) {
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
