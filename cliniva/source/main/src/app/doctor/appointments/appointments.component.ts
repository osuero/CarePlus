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
import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { AppointmentsService } from './appointments.service';
import { Appointments } from './appointments.model';
import { rowsAnimation, TableExportUtil } from '@shared';
import { formatDate, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DoctorAppointmentFormComponent } from './form/form.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  animations: [rowsAnimation],
  imports: [
    BreadcrumbComponent,
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
    MatRippleModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatPaginatorModule,
    DatePipe,
  ],
})
export class AppointmentsComponent implements OnInit, OnDestroy {
  columnDefinitions = [
    { def: 'id', label: 'ID', type: 'string', visible: false },
    { def: 'patientName', label: 'Patient Name', type: 'text', visible: true },
    {
      def: 'appointmentDate',
      label: 'Appointment Date',
      type: 'date',
      visible: true,
    },
    { def: 'appointmentTime', label: 'Time', type: 'time', visible: true },
    { def: 'email', label: 'Email', type: 'email', visible: true },
    { def: 'mobile', label: 'Mobile', type: 'phone', visible: true },

    { def: 'gender', label: 'Gender', type: 'text', visible: true },

    { def: 'status', label: 'Status', type: 'text', visible: true },
    { def: 'address', label: 'Address', type: 'address', visible: true },
    { def: 'disease', label: 'Disease', type: 'text', visible: true },
    {
      def: 'lastVisitDate',
      label: 'Last Visit Date',
      type: 'date',
      visible: true,
    },
    { def: 'actions', label: 'Actions', type: 'actionBtn', visible: true },
  ];

  dataSource = new MatTableDataSource<Appointments>([]);
  selection = new SelectionModel<Appointments>(true, []);
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
    public appointmentsService: AppointmentsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((cd) => cd.visible)
      .map((cd) => cd.def);
  }

  loadData() {
    this.appointmentsService.getAllAppointments().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (
          data: Appointments,
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

  detailsCall(row: Appointments) {
    this.dialog.open(DoctorAppointmentFormComponent, {
      data: {
        appointments: row,
        action: 'details',
      },
      height: '70%',
      width: '35%',
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
    const exportData = this.dataSource.filteredData.map((x) => ({
      ID: x.id,
      'Patient Name': x.patientName,
      Email: x.email,
      Mobile: x.mobile,
      'Appointment Date & Time':
        formatDate(new Date(x.appointmentDate), 'yyyy-MM-dd HH:mm', 'en') || '',
      Status: x.status,
      Address: x.address,
      Disease: x.disease,
      'Last Visit Date':
        formatDate(new Date(x.lastVisitDate), 'yyyy-MM-dd', 'en') || '',
    }));

    TableExportUtil.exportToExcel(exportData, 'appointment_data_export');
  }
}
