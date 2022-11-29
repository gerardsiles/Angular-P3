import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Song } from '../song/models/Song';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss'],
})
export class SongItemComponent implements OnInit {
  @Input() song: Song;
  @Output() songItem: Song;
  @Output() showSong: EventEmitter<Song> = new EventEmitter();
  public visible: boolean = false;

  constructor(private router: Router, private uiService: UiService) {}

  ngOnInit(): void {}

  public navigate(song: any): void {
    let songTitle: string = '';

    song.type === 'title' ? (songTitle = song.title) : (songTitle = song.title);

    // this.router.navigate(['/artist', songId]);
    this.router.navigate(['/song', songTitle]);
  }

  // Method using uiService to load the song to be shown on the player
  renderSong(songItem: Song) {
    this.uiService.emitSongEvent(songItem);
  }

  handleShow(event: any) {
    this.visible = event;
  }
}
