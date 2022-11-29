import { Component, OnInit, Input } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { AudioService } from 'src/app/services/audio.service';
import { MatSliderModule } from '@angular/material/slider';
import { Song } from '../song/models/Song';
import { StreamState } from 'src/app/interfaces/stream-state';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  @Input() song: Song;
  public showVolume: boolean = false;

  // public track = new Audio();
  state: StreamState;

  constructor(private ui: UiService, private audioService: AudioService) {
    this.audioService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  ngOnInit(): void {}

  playStream() {
    this.audioService
      .playStream(this.song.location, this.song.title)
      .subscribe((events) => {});
  }

  openFile(song: Song) {
    this.audioService.stop();
    this.playStream();
  }

  toggleAudio(): void {
    this.showVolume = !this.showVolume;
  }

  // Method to transfor the seconds of the song to minutes
  getDuracion(): string {
    const minutes = Math.floor(this.song.length / 60);
    const seconds = this.song.length % 60;

    function padTo2Digits(num: number) {
      return num.toString().padStart(2, '0');
    }
    return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
  }

  togglePlay() {
    this.audioService.play();
  }
  async togglePause(): Promise<void> {
    this.audioService.pause();
  }

  continue() {
    this.audioService.playFrom();
  }

  toggleStop() {
    this.audioService.stop();
  }

  onSliderChangeEnd(change: any) {
    this.audioService.seekTo(change.value);
  }

  // change the audio level
  onVolumeChangeEnd(change: any) {
    this.audioService.changeVolume(change.value);
  }
}
