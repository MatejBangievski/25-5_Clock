import { Component, ElementRef, computed, effect, signal, viewChild } from '@angular/core';
import { ClockSetting } from './clock-setting/clock-setting';
import { TimerDisplay } from './timer-display/timer-display';
import { ClockControls } from './clock-controls/clock-controls';
import {
  DEFAULT_BREAK_LENGTH,
  DEFAULT_SESSION_LENGTH,
  MAX_CLOCK_LENGTH,
  MIN_CLOCK_LENGTH,
  TICK_INTERVAL_MS,
} from './constants/clock.constants';

@Component({
  selector: 'app-root',
  imports: [ClockSetting, TimerDisplay, ClockControls],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  breakLength = signal(DEFAULT_BREAK_LENGTH);
  sessionLength = signal(DEFAULT_SESSION_LENGTH);
  timerLabel = signal<'Break' | 'Session'>('Session');
  timeLeft = signal(DEFAULT_SESSION_LENGTH * 60);
  isRunning = signal(false);

  private intervalId: number | null = null;
  private beepAudio = viewChild.required<ElementRef<HTMLAudioElement>>('beepAudio');

  onStartStop(): void {
    this.isRunning() ? this.pauseTimer() : this.startTimer();
  }

  private startTimer(): void {
    this.unlockAudio();
    this.isRunning.set(true);
    this.intervalId = setInterval(() => this.tick(), TICK_INTERVAL_MS);
  }

  private pauseTimer(): void {
    this.isRunning.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick(): void {
    if (this.timeLeft() > 0) {
      this.timeLeft.update((secondsLeft) => secondsLeft - 1);
      return;
    }

    this.playBeep();
    this.switchPhase();
  }

  private switchPhase(): void {
    if (this.timerLabel() === 'Session') {
      this.timerLabel.set('Break');
      this.timeLeft.set(this.breakLength() * 60);
    } else {
      this.timerLabel.set('Session');
      this.timeLeft.set(this.sessionLength() * 60);
    }
  }

  adjustLength(type: 'Break' | 'Session', isIncrement: boolean): void {
    if (this.isRunning()) return;

    const target = type === 'Break' ? this.breakLength : this.sessionLength;
    const delta = isIncrement ? 1 : -1;

    target.update((current) => {
      const next = current + delta;
      return next >= MIN_CLOCK_LENGTH && next <= MAX_CLOCK_LENGTH ? next : current;
    });

    if (type === this.timerLabel()) {
      this.timeLeft.set(target() * 60);
    }
  }

  onReset(): void {
    this.pauseTimer();
    this.breakLength.set(DEFAULT_BREAK_LENGTH);
    this.sessionLength.set(DEFAULT_SESSION_LENGTH);
    this.timerLabel.set('Session');
    this.timeLeft.set(DEFAULT_SESSION_LENGTH * 60);
    this.resetBeep();
  }

  // For Safari web browser
  private unlockAudio(): void {
    const audio = this.beepAudio().nativeElement;
    const originalVolume = audio.volume;
    audio.volume = 0;

    audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = originalVolume;
      });
  }

  private playBeep(): void {
    const audio = this.beepAudio().nativeElement;
    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.warn('Unable to play beep sound:', error);
    });
  }

  // To stop the audio being played if the user clicks the reset button
  private resetBeep(): void {
    const audio = this.beepAudio().nativeElement;
    audio.pause();
    audio.currentTime = 0;
  }

  accentColor = computed(() => {
    if (!this.isRunning()) return 'var(--color-idle)';
    return this.timerLabel() === 'Session' ? 'var(--color-session)' : 'var(--color-break)';
  });
}
