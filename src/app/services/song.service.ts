import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Song } from '../models/song';

@Injectable()
export class SongService {

    public url: string;

    constructor(
        private _http: HttpClient
    ){
        this.url = GLOBAL.url;
    }

	saveSong(token, song_to_register):Observable<any>{
		let params = JSON.stringify(song_to_register);
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'guardar-cancion', params, {headers: headers})
	}

    getSong(token, id:string):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

        return this._http.get(this.url+'cancion/'+id, {headers: headers});
    }

    getSongs(token, albumId = null):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

        if(albumId == null){
            return this._http.get(this.url+'canciones', {headers: headers});
        } else {
            return this._http.get(this.url+'canciones/'+albumId, {headers: headers});
        }
    }

    editSong(token, id:string, Song_to_update):Observable<any>{
        let params = JSON.stringify(Song_to_update);
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

		return this._http.put(this.url+'cancion/'+id, params, {headers: headers})
    }

    deleteSong(token, id:string):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

        return this._http.delete(this.url+'cancion/'+id, {headers: headers});
    }
}