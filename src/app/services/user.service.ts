import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class UserService {
    public url: string;
    public identity;
    public token;

    constructor(
        private _http: HttpClient
    ){
        this.url = GLOBAL.url;
    }

    login(user_to_login, gethash = null):Observable<any>{

        //sacar el token
        if(gethash != null){
            user_to_login.gethash = gethash;
        }

        let params = JSON.stringify(user_to_login);

        let headers = new HttpHeaders({'Content-Type' : 'application/json'});

        return this._http.post(this.url +'login-usuario', params, {headers: headers});
    }

    register(user_to_register):Observable<any>{
        let params = JSON.stringify(user_to_register);

        let headers = new HttpHeaders({'Content-Type' : 'application/json'});

        return this._http.post(this.url +'registro-usuario', params, {headers: headers});
    }

    updateUser(user_to_update):Observable<any>{
        let params = JSON.stringify(user_to_update);

        let headers = new HttpHeaders().set('Content-Type' , 'application/json')
                                        .set('Authorization', this.token);

        return this._http.put(this.url +'actualizar-usuario/'+user_to_update._id , params, {headers: headers});
    }

    //obtener token
    getToken(){
        let token = localStorage.getItem('token');

        if(token != "undefined"){
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }
    //obtener la identity
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity != "undefined"){
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
    }

}