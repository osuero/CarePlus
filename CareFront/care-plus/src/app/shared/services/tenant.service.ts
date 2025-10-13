import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly tenantSubject = new BehaviorSubject<string>('default');

  readonly tenant$: Observable<string> = this.tenantSubject.asObservable();

  get currentTenant(): string {
    return this.tenantSubject.value;
  }

  setTenant(tenant: string): void {
    if (!tenant) {
      return;
    }

    this.tenantSubject.next(tenant);
  }
}
