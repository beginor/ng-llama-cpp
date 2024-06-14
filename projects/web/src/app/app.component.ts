import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        SidebarComponent,
    ],
    template: `
        <app-sidebar data-bs-theme='dark'/>
        <div class='flex-grow-1 bg-light d-flex'>
            <router-outlet />
        </div>
    `,
    styles: [],
})
export class AppComponent {

}
