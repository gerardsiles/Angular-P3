import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SongServiceService } from 'src/app/services/song-service.service';
import { Observable, of, Subject } from 'rxjs';

import { SONGS } from '../../../assets/dummyData';
import { Song } from '../song/models/Song';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public songs: Song[];
  public song: Song;
  public searchResult: Song[] = [];
  searchTitle: string = '';
  searching: boolean = false;

  subscription: Subscription;

  constructor(private songService: SongServiceService) {}

  ngOnInit(): void {
    this.getSongs();
  }

  public getSongs(): void {
    this.songService.getSongs().subscribe((songs) => (this.songs = songs));
  }

  filteredSongs(searchTerm: string) {
    this.searching = true;
    if (searchTerm.length === 0) {
      this.searching = false;
    }
    // Resetear la busqueda al borrar caracter
    if (this.searchTitle.length > searchTerm.length) {
      this.searchResult = this.searchSongs(searchTerm);
    }
    this.searchTitle = searchTerm;

    if (searchTerm) {
      // this.songService.search(song).subscribe((songs) => (this.songs = songs));
      this.searchResult = this.searchSongs(searchTerm);
    } else {
      return this.getSongs();
    }
  }

  searchSongs(searchTerm: string) {
    return this.songs.filter(
      (song) =>
        song.title.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        song.author.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
  }
}
