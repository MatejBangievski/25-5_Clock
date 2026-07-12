import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-clock-setting',
  imports: [],
  templateUrl: './clock-setting.html',
  styleUrl: './clock-setting.css'
})
export class ClockSetting {
  // Cant i have a model here and a function that will change it> (breakLenght and sessionLength)

  // Inputs — one-way, down from AppComponent
  type = input.required<'Break' | 'Session'>();
  label = input.required<string>();
  length = input.required<number>();
  disabled = input(false);

  // Outputs — events up to AppComponent. No payload needed;
  // the parent already knows which instance fired because of
  // how it bound the template (type="break" vs type="session").

  // Change to model()
  decrement = output<void>();
  increment = output<void>();

  // Derived, read-only — ids are computed from `type` so they
  // always match break-label / session-label / break-length / etc.
  // maybe add toLower
  labelId = computed(() => `${this.type()}-label`);
  lengthId = computed(() => `${this.type()}-length`);
  decrementId = computed(() => `${this.type()}-decrement`);
  incrementId = computed(() => `${this.type()}-increment`);
}
