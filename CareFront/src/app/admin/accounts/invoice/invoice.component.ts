import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface InvoiceItem {
  no: number;
  description: string;
  quantity: string;
  unitPrice: string;
  charges: string;
  discount: string;
  total: string;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  imports: [
    BreadcrumbComponent, 
    MatButtonModule, 
    MatCardModule, 
    MatIconModule,
    MatTableModule
  ]
})
export class InvoiceComponent {
  displayedColumns: string[] = ['no', 'description', 'quantity', 'unitPrice', 'charges', 'discount', 'total'];
  
  invoiceItems: InvoiceItem[] = [
    { no: 1, description: 'Visiting Charges', quantity: '-', unitPrice: '-', charges: '$100', discount: '-', total: '$100' },
    { no: 2, description: 'Medicines', quantity: '10', unitPrice: '$15', charges: '$150', discount: '5%', total: '$1000' },
    { no: 3, description: 'X-ray Reports', quantity: '4', unitPrice: '$600', charges: '$70', discount: '5%', total: '$1200' },
    { no: 4, description: 'MRI', quantity: '2', unitPrice: '$245', charges: '$125', discount: '10%', total: '$480' },
    { no: 5, description: 'Other Charges', quantity: '-', unitPrice: '-', charges: '-', discount: '-', total: '$300' },
  ];

  constructor() {
    // constructor code
  }
}
