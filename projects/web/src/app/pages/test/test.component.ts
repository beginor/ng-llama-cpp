import { Component } from '@angular/core';

import {
    getServerHealth, ServerHealth, getServerProps, ServerProps
} from 'llama-cpp';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent {

    protected health?: ServerHealth;

    protected async getServerHealth(): Promise<void> {
        this.health = await getServerHealth();
        console.log(this.health);
    }

    protected async getServerProps(): Promise<void> {
        const props = await getServerProps();
        console.log(props);
    }

}
