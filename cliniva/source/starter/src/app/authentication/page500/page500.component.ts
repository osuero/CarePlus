import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-page500',
  templateUrl: './page500.component.html',
  styleUrls: ['./page500.component.scss'],
  imports: [FormsModule, MatButtonModule, RouterLink, MatCardModule],
})
export class Page500Component {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/dashboard/dashboard1']);
  }
}
