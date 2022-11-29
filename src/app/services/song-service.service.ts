import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { Song } from '../components/song/models/Song';

import { map, catchError, filter } from 'rxjs/operators';
import { SONGS } from '../../assets/dummyData';

@Injectable({
  providedIn: 'root',
})
export class SongServiceService {
  private url: string = '../../assets/dummyData.json';

  constructor(private http: HttpClient) {}

  public getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.url);
  }

  search(term: string): Observable<Song[]> {
    term = term.trim();
    const options = term ? { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Song[]>(this.url, options);
  }
}
