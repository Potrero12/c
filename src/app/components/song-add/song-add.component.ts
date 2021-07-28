import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service';
import { SongService } from '../../services/song.service';
import { GLOBAL } from '../../services/global';

import { Artist } from '../../models/artist';
import { Album } from '../../models/album';
import { Song } from '../../models/song';

@Component({
    selector: 'song-add',
    templateUrl: './song-add.component.html',
    providers: [UserService, SongService]
})
export class SongAddComponent implements OnInit{

    public titulo: string;
    public song: Song;
    public identity;
    public token;
    public url;
    public alertMessage;
    public is_edit = false;

    constructor(
        private _userService: UserService,
        private _songService: SongService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = 'Crear Cancion Nueva';
        this.url = GLOBAL.url;
        this.song =  new Song(1 , '', '', '', '');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }

    ngOnInit(){
        console.log('SongAddComponent.ts cargado')
    }

    onSubmit(){
        
        this._route.params.forEach((params: Params) => {
            let albumId = params['album'];
            this.song.album = albumId;

            console.log(this.song);

        this._songService.saveSong(this.token, this.song).subscribe(
            response => {
                if(!response.song){
                    this.alertMessage = 'Error En El Servidor';
                } else {
                    this.alertMessage = 'Cancion Creado Correctamente';
                    this.song = response.song;
                    this._router.navigate(['/editar-cancion', response.song._id]);
                }
            },
            error => {
                var errorMessage = <any>error;
                
                if(errorMessage != null){
                  var body = JSON.parse(error._body);
                  this.alertMessage = body.message;
                }
              }
        )
        });
    }
}