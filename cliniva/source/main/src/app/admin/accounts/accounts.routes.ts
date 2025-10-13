import { IncomeReportComponent } from './income-report/income-report.component';
import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { AddBillComponent } from './add-bill/add-bill.component';
import { BillListComponent } from './bill-list/bill-list.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { IncomeComponent } from './income/income.component';
import { ExpensesComponent } from './expenses/expenses.component';

export const ACCOUNTS_ROUTE: Route[] = [
  {
    path: 'bill-list',
    component: BillListComponent,
  },
  {
    path: 'add-bill',
    component: AddBillComponent,
  },
  {
    path: 'income',
    component: IncomeComponent,
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
  },
  {
    path: 'income-report',
    component: IncomeReportComponent,
  },
  {
    path: 'invoice',
    component: InvoiceComponent,
  },
  { path: '**', component: Page404Component },
];
