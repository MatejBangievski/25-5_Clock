import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-clock-setting',
  imports: [],
  templateUrl: './clock-setting.html',
  styleUrl: './clock-setting.css',
})
export class ClockSetting {
  type = input.required<'Break' | 'Session'>();
  label = input.required<string>();
  length = input.required<number>();
  disabled = input(false);

  decrement = output<void>();
  increment = output<void>();

  // To satisfy the user-stories
  labelId = computed(() => `${this.type().toLowerCase()}-label`);
  lengthId = computed(() => `${this.type().toLowerCase()}-length`);
  decrementId = computed(() => `${this.type().toLowerCase()}-decrement`);
  incrementId = computed(() => `${this.type().toLowerCase()}-increment`);
}
