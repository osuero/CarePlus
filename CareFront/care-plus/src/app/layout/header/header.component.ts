import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { TenantService } from '../../shared/services/tenant.service';
import { IconComponent } from '../../shared/icon/icon.component';

interface LanguageOption {
  code: string;
  label: string;
}

interface TenantOption {
  id: string;
  labelKey: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private readonly translate = inject(TranslateService);
  private readonly tenantService = inject(TenantService);

  @Input({ required: true }) pageTitleKey!: string;
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly languages: LanguageOption[] = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' }
  ];

  readonly tenants: TenantOption[] = [
    { id: 'default', labelKey: 'userRegistration.tenantOptions.default' },
    { id: 'clinic-a', labelKey: 'userRegistration.tenantOptions.clinicA' },
    { id: 'clinic-b', labelKey: 'userRegistration.tenantOptions.clinicB' }
  ];

  readonly activeLang = signal(this.translate.currentLang || this.translate.defaultLang || 'es');
  readonly activeTenant = toSignal(this.tenantService.tenant$, {
    initialValue: this.tenantService.currentTenant
  });

  constructor() {
    document.documentElement.lang = this.activeLang();
  }

  changeLang(code: string): void {
    if (!code || this.activeLang() === code) {
      return;
    }

    this.activeLang.set(code);
    this.translate.use(code);
    document.documentElement.lang = code;
  }

  changeTenant(id: string): void {
    this.tenantService.setTenant(id);
  }

  logout(): void {
    console.info('logout requested');
  }
}
