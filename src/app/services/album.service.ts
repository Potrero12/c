import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Album } from '../models/album';

@Injectable()
export class AlbumService {

    public url: string;

    constructor(
        private _http: HttpClient
    ){
        this.url = GLOBAL.url;
    }

	saveAlbum(token, album_to_register):Observable<any>{
		let params = JSON.stringify(album_to_register);
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

		return this._http.post(this.url+'guardar-album', params, {headers: headers})
	}

    getAlbum(token, id:string):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

        return this._http.get(this.url+'album/'+id, {headers: headers});
    }

    getAlbums(token, artistId = null):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

        if(artistId == null){
            return this._http.get(this.url+'albumes', {headers: headers});
        } else {
            return this._http.get(this.url+'albumes/'+artistId, {headers: headers});
        }
    }

    editAlbumt(token, id:string, album_to_update):Observable<any>{
        let params = JSON.stringify(album_to_update);
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

		return this._http.put(this.url+'album/'+id, params, {headers: headers})
    }

    deleteAlbum(token, id:string):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization', token);

        return this._http.delete(this.url+'album/'+id, {headers: headers});
    }
}