import { Component, input } from '@angular/core';
import { FeatherModule } from 'angular-feather';

@Component({
    selector: 'app-feather-icons',
    templateUrl: './feather-icons.component.html',
    styleUrls: ['./feather-icons.component.scss'],
    imports: [FeatherModule]
})
export class FeatherIconsComponent {
  public readonly icon = input<string>();
  public readonly class = input<string>();
  constructor() {
    // constructor
  }
}
