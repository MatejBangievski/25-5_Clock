import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-clock-controls',
  imports: [],
  templateUrl: './clock-controls.html',
  styleUrl: './clock-controls.css',
})
export class ClockControls {
  isRunning = input.required<boolean>();

  startStop = output<void>();
  reset = output<void>();
}
