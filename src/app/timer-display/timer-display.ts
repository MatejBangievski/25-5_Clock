import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-timer-display',
  imports: [],
  templateUrl: './timer-display.html',
  styleUrl: './timer-display.css',
})
export class TimerDisplay {
  label = input.required<'Break' | 'Session'>();
  timeLeftInSeconds = input.required<number>();
  isRunning = input.required<boolean>();

  formattedTime = computed(() => this.formatTimeAsMMSS(this.timeLeftInSeconds()));

  formatTimeAsMMSS(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}
