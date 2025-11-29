import { Component, Input, inject } from '@angular/core';
import { AuthService } from '@core';

@Component({
    selector: 'app-doc-welcome-card',
    imports: [],
    templateUrl: './doc-welcome-card.component.html',
    styleUrl: './doc-welcome-card.component.scss'
})
export class DocWelcomeCardComponent {
    private readonly auth = inject(AuthService);
    readonly displayName = this.auth.currentUserValue?.name ?? 'Doctor';
    @Input() appointmentsCount = 0;
}
