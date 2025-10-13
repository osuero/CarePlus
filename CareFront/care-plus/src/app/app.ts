import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  template: '<router-outlet />'
})
export class AppComponent {
  constructor(private readonly translate: TranslateService) {
    const defaultLanguage = this.translate.defaultLang || 'es';
    this.translate.use(defaultLanguage);
  }
}

