import { formatDate } from '@angular/common';

export class Expenses {
  expense_id: string;
  date: string;
  category: string;
  description: string;
  amount: string;
  vendor: string;
  invoice_number: string;
  payment_method: string;
  department: string;
  budget_code: string;
  employee_responsible: string;
  approval_status: string;
  payment_status: string;
  notes: string;
  tax: string;
  total_cost: string;
  currency: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;

  constructor(expenses: Partial<Expenses> = {}) {
    this.expense_id = expenses.expense_id || this.getRandomID();
    this.date = expenses.date || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.category = expenses.category || '';
    this.description = expenses.description || '';
    this.amount = expenses.amount || '';
    this.vendor = expenses.vendor || '';
    this.invoice_number = expenses.invoice_number || '';
    this.payment_method = expenses.payment_method || '';
    this.department = expenses.department || '';
    this.budget_code = expenses.budget_code || '';
    this.employee_responsible = expenses.employee_responsible || '';
    this.approval_status = expenses.approval_status || '';
    this.payment_status = expenses.payment_status || '';
    this.notes = expenses.notes || '';
    this.tax = expenses.tax || '';
    this.total_cost = expenses.total_cost || '';
    this.currency = expenses.currency || 'USD';
    this.created_by = expenses.created_by || '';
    this.created_at =
      expenses.created_at || formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.updated_by = expenses.updated_by || '';
    this.updated_at =
      expenses.updated_at || formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  public getRandomID(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000).toString(5);
    };
    return S4() + S4();
  }
}
