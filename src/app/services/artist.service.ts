import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService {

    public url: string;

    constructor(
        private _http: HttpClient
    ){
        this.url = GLOBAL.url;
    }

	register(token, artist_to_register): Observable<any>{
		let params = JSON.stringify(artist_to_register);
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'guardar-artista', params, {headers: headers})
	}

    editArtist(token, id:string, artist_to_update):Observable<any>{
        let params = JSON.stringify(artist_to_update);
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

		return this._http.put(this.url+'artista/'+id, params, {headers: headers})
    }

    getArtists(token, page):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

        return this._http.get(this.url+'artistas/'+page, {headers: headers});
    }

    getArtist(token, id:string):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

        return this._http.get(this.url+'artista/'+id, {headers: headers});
    }

    deleteArtist(token, id:string):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

        return this._http.delete(this.url+'artista/'+id, {headers: headers});
    }

}