import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { StreamState } from '../interfaces/stream-state';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private stop$ = new Subject();
  private audioObj = new Audio();
  private state: StreamState = {
    songTitle: '',
    playing: false,
    paused: false,
    readableCurrentTime: '',
    readableDuration: '',
    readableTimeLeft: '',
    duration: undefined,
    currentTime: undefined,
    volume: 0.8,
    canplay: false,
    error: false,
  };

  audioEvents = [
    'ended',
    'error',
    'play',
    'playing',
    'pause',
    'stop',
    'volue',
    'timeupdate',
    'canplay',
    'loadedmetadata',
    'loadstart',
  ];

  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
    this.state
  );

  private streamObservable(url: string) {
    return new Observable((observer) => {
      // Play audio
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.state.playing = false;
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // reset state
        this.resetState();
      };
    });
  }

  private addEvents(obj: any, events: any, handler: any) {
    events.forEach((event: any) => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: any, events: any, handler: any) {
    events.forEach((event: any) => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(url: string, songTitle: string) {
    this.state.songTitle = songTitle;
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.readableTimeLeft = this.formatTime(
          this.state.duration - this.audioObj.currentTime
        );
        this.state.canplay = true;
        break;
      case 'playing':
        this.state.playing = true;
        this.state.readableTimeLeft = this.formatTime(
          this.audioObj.duration - this.audioObj.currentTime
        );
        break;

      case 'pause':
        this.state.playing = false;
        break;
      case 'timeupdate':
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        this.state.readableTimeLeft = this.formatTime(
          this.audioObj.duration - this.audioObj.currentTime
        );
        break;
      case 'volume':
        this.state.volume = this.audioObj.volume;
        break;
      case 'error':
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }

  private resetState() {
    this.state = {
      songTitle: '',
      playing: false,
      paused: false,
      readableCurrentTime: '',
      readableDuration: '',
      readableTimeLeft: '',
      duration: undefined,
      currentTime: undefined,
      volume: 0.8,
      canplay: false,
      error: false,
    };
  }

  play() {
    this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
    this.state.paused = true;
  }

  playFrom() {
    let tempValue = this.state.currentTime;
    this.audioObj.play();
    this.state.currentTime = tempValue;
    this.state.paused = false;
  }

  stop() {
    this.audioObj.currentTime = 0;
    this.stop$.next(this.state);
  }

  seekTo(seconds: number) {
    this.audioObj.currentTime = seconds;
  }

  changeVolume(volume: number) {
    this.audioObj.volume = volume;
    this.state.volume = volume;
  }

  formatTime(time: number, format: string = 'mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }
}
